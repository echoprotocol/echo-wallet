import { key, PrivateKey } from 'echojs-lib';
import { EchoJSActions, ChainStore } from 'echojs-redux';
import { List } from 'immutable';

import { openModal, setDisable } from './ModalActions';
import { set as setKey } from './KeyChainActions';
import { addAccount, isAccountAdded } from './GlobalActions';

import {
	setFormValue,
	setFormError,
	toggleLoading,
	setValue,
} from './FormActions';

import { FORM_SIGN_UP, FORM_SIGN_IN } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_CHOOSE_ACCOUNT } from '../constants/ModalConstants';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

import { formatError } from '../helpers/FormatHelper';
import { validateAccountName, validatePassword } from '../helpers/ValidateHelper';

import {
	validateAccountExist,
	unlockWallet,
	getKeyFromWif,
} from '../api/WalletApi';
import AuthApi from '../api/AuthApi';

export const generatePassword = () => (dispatch) => {
	const generatedPassword = (`P${key.get_random_key().toWif()}`).substr(0, 45);

	dispatch(setFormValue(FORM_SIGN_UP, 'generatedPassword', generatedPassword));
};

export const createAccount = ({
	accountName, generatedPassword, confirmPassword,
}, isAddAccount) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);
	let confirmPasswordError = validatePassword(confirmPassword);

	if (generatedPassword !== confirmPassword) {
		confirmPasswordError = 'Passwords do not match';
	}

	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
		return;
	}

	if (confirmPasswordError) {
		dispatch(setFormError(FORM_SIGN_UP, 'confirmPassword', confirmPasswordError));
		return;
	}

	try {
		const instance = getState().echojs.getIn(['system', 'instance']);

		const network = getState().global.getIn(['network']).toJS();
		accountNameError = await validateAccountExist(instance, accountName, false);

		if (isAddAccount && !accountNameError) {
			accountNameError = isAccountAdded(accountName, network.name);
		}

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
			return;
		}

		dispatch(toggleLoading(FORM_SIGN_UP, true));

		const {
			active, echoRandKey,
		} = await AuthApi.registerAccount(
			instance,
			accountName,
			generatedPassword,
		);

		dispatch(setKey(active, accountName, generatedPassword, 'active'));
		dispatch(setKey(echoRandKey, accountName, generatedPassword, 'echoRand'));

		dispatch(addAccount(accountName, network.name));

	} catch (err) {
		dispatch(setValue(FORM_SIGN_UP, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
	}

};


export const authUser = ({ accountName, password }) => async (dispatch, getState) => {

	let accountNameError = validateAccountName(accountName);
	const passwordError = validatePassword(password);

	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
		return false;
	}

	if (passwordError) {
		dispatch(setFormError(FORM_SIGN_IN, 'password', passwordError));
		return false;
	}

	const networkName = getState().global.getIn(['network', 'name']);

	try {
		const instance = getState().echojs.getIn(['system', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

		if (!accountNameError) {
			accountNameError = isAccountAdded(accountName, networkName);
		}

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
			return true;
		}

		dispatch(toggleLoading(FORM_SIGN_IN, true));
		const account = await dispatch(EchoJSActions.fetch(accountName));

		const { active, memo } = unlockWallet(account, password);

		if (!active && !memo) {
			dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
			return false;
		}

		if (active) {
			dispatch(setKey(active, accountName, password, 'active'));
		}

		if (memo) {
			dispatch(setKey(memo, accountName, password, 'memo'));
		}

		dispatch(addAccount(accountName, networkName));
		return false;
	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_IN, false));
	}
	return false;

};

/**
 *  @method getAccountsList
 *
 * 	Forming an accounts list for choose accounts in modal
 *
 * 	@param {Object}
 *
 */
const getAccountsList = (accounts) => async (dispatch) => {

	const asset = await dispatch(EchoJSActions.fetch(ECHO_ASSET_ID));
	accounts = accounts.map(async (acc) => {
		const account = {
			name: acc.get('name'),
			id: acc.get('id'),
			checked: false,
			balances: {
				symbol: asset.get('symbol'),
				precision: asset.get('precision'),
			},
		};

		if (acc.has('balances') && acc.hasIn(['balances', ECHO_ASSET_ID])) {
			const stats = await dispatch(EchoJSActions.fetch(acc.getIn(['balances', ECHO_ASSET_ID])));
			account.balances.balance = stats.get('balance');
		} else {
			account.balances.balance = 0;
		}

		return account;

	});
	accounts = await Promise.all(accounts);

	dispatch(openModal(MODAL_CHOOSE_ACCOUNT, { accounts: new List(accounts) }));
};

/**
 *  @method importAccount
 *  Import account
 *
 * 	@param {String} accountName
 * @param {String} password
 *
 */
export const importAccount = ({ accountName, password }) =>
	async (dispatch, getState) => {
		if (getKeyFromWif(password)) {

			const active = PrivateKey.fromWif(password).toPublicKey().toString();
			const networkName = getState().global.getIn(['network', 'name']);

			try {
				let accountIDs = await ChainStore.FetchChain('getAccountRefsOfKey', active);
				if (!accountIDs.size) {
					dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
					return;
				}
				accountIDs = new Set(accountIDs.toArray());
				accountIDs = [...accountIDs];

				const accounts = await ChainStore.FetchChain('getAccount', accountIDs);

				accounts.forEach((n) => {
					if (isAccountAdded(n.get('name'), networkName)) {
						accountIDs = accountIDs.filter((item) => n.get('id') !== item);
					}
				});

				if (accountIDs.length > 1) {
					dispatch(getAccountsList(accounts));
					return;
				}

				const account = await ChainStore.FetchChain('getAccount', accountIDs[0]);

				if (accountName && account.get('name') !== accountName) {
					dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
					return;
				}

				dispatch(authUser({ accountName: account.get('name'), password }));
				return;


			} catch (error) {
				dispatch(setValue(FORM_SIGN_IN, 'error', error));
			}

		}
		dispatch(authUser({ accountName, password }));
	};

/**
 *  @method importSelectedAccounts
 *
 *  Log in selected accounts
 *
 *  @param {Array} accounts
 *  @param {String} password
 *
 */
export const importSelectedAccounts = (accounts, password) => async (dispatch) => {
	accounts.forEach((account) => {
		if (account.checked) {
			dispatch(authUser({ accountName: account.name, password }));
		}
	});
};

export const unlockAccount = (account, password) => (dispatch) => {

	try {
		dispatch(setDisable(MODAL_UNLOCK, true));

		const passwordError = validatePassword(password);

		if (passwordError) {
			return { error: passwordError };
		}

		const keys = unlockWallet(account, password);

		if (!keys.active) {
			return { error: 'Invalid password' };
		}

		Object.entries(keys).forEach(([role, value]) => {
			dispatch(setKey(value, account.get('name'), password, role));
		});

		return { keys };
	} catch (err) {
		return { error: formatError(err) };
	} finally {
		dispatch(setDisable(MODAL_UNLOCK, false));
	}

};

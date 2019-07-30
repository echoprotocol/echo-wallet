import { PrivateKey } from 'echojs-lib';
import { EchoJSActions, ChainStore } from 'echojs-redux';
import { List } from 'immutable';
import random from 'crypto-random-string';

import { openModal, toggleLoading as toggleModalLoading, setError, closeModal } from './ModalActions';
import { addAccount, isAccountAdded } from './GlobalActions';

import {
	setFormValue,
	setFormError,
	toggleLoading,
	setValue,
} from './FormActions';

import { FORM_SIGN_UP, FORM_SIGN_IN } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_CHOOSE_ACCOUNT } from '../constants/ModalConstants';
import { ECHO_ASSET_ID, RANDOM_SIZE, USER_STORAGE_SCHEMES } from '../constants/GlobalConstants';

import { formatError } from '../helpers/FormatHelper';
import { validateAccountName, validateWIF } from '../helpers/ValidateHelper';

import {
	validateAccountExist,
	unlockWallet,
	getKeyFromWif,
} from '../api/WalletApi';
import AuthApi from '../api/AuthApi';

import Services from '../services';
import Key from '../logic-components/db/models/key';

export const generateWIF = () => (dispatch) => {
	const privateKey = PrivateKey.fromSeed(random({ length: RANDOM_SIZE }));

	dispatch(setFormValue(FORM_SIGN_UP, 'generatedWIF', privateKey.toWif()));
};

export const createAccount = ({
	accountName, generatedWIF, confirmWIF, password,
}, isAddAccount) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);
	let confirmWIFError = validateWIF(confirmWIF);

	if (generatedWIF !== confirmWIF) {
		confirmWIFError = 'WIFs do not match';
	}

	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
		return;
	}

	if (confirmWIFError) {
		dispatch(setFormError(FORM_SIGN_UP, 'confirmWIF', confirmWIFError));
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

		const { publicKey } = await AuthApi.registerAccount(
			instance,
			accountName,
			generatedWIF,
		);

		const userStorage = Services.getUserStorage();
		const account = await dispatch(EchoJSActions.fetch(accountName));
		await userStorage.addKey(Key.create(publicKey, generatedWIF, account.get('id')), { password });

		dispatch(addAccount(accountName, network.name));

	} catch (err) {
		dispatch(setValue(FORM_SIGN_UP, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
	}

};


export const authUser = ({ accountName, wif, password }) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);
	const wifError = validateWIF(wif);

	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
		return false;
	}

	if (wifError) {
		dispatch(setFormError(FORM_SIGN_IN, 'wif', wifError));
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

		const key = unlockWallet(account, wif);

		if (!key) {
			dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
			return false;
		}

		const userStorage = Services.getUserStorage();
		await userStorage.addKey(Key.create(key.publicKey, wif, account.get('id')), { password });

		dispatch(addAccount(accountName, networkName));

		return false;
	} catch (err) {
		console.log(err);
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
 * @param {String} wif
 *
 */
export const importAccount = ({ accountName, wif, password }) =>
	async (dispatch, getState) => {
		const wifError = validateWIF(wif);

		if (wifError) {
			dispatch(setFormError(FORM_SIGN_IN, 'wif', wifError));
			return;
		}

		const key = getKeyFromWif(wif);

		if (!key) {
			dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
			return;
		}

		const active = key.toPublicKey().toString();
		const networkName = getState().global.getIn(['network', 'name']);

		try {
			let accountIDs = await ChainStore.FetchChain('getAccountRefsOfKey', active);
			if (!accountIDs.size) {
				dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
				return;
			}

			accountIDs = accountIDs.toSet().toArray();

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
				dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
				return;
			}

			dispatch(authUser({ accountName: account.get('name'), wif, password }));
			return;

		} catch (error) {
			dispatch(setValue(FORM_SIGN_IN, 'error', error));
		}
	};

/**
 *  @method importSelectedAccounts
 *
 *  Log in selected accounts
 *
 *  @param {Array} accounts
 *  @param {String} wif
 *
 */
export const importSelectedAccounts = (accounts, wif) => async (dispatch) => {
	accounts.forEach((account) => {
		if (account.checked) {
			dispatch(authUser({ accountName: account.name, wif }));
		}
	});
};

export const unlock = (password, callback = () => {}) => async (dispatch) => {
	try {
		dispatch(toggleModalLoading(MODAL_UNLOCK, true));

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			dispatch(setError(MODAL_UNLOCK, 'DB doesn\'t exist'));
			return;
		}

		await userStorage.setScheme(USER_STORAGE_SCHEMES.MANUAL, password);
		const correctPassword = await userStorage.isMasterPassword(password);

		if (!correctPassword) {
			dispatch(setError(MODAL_UNLOCK, 'Invalid password'));
			return;
		}

		dispatch(closeModal(MODAL_UNLOCK));

		callback(password);
	} catch (err) {
		dispatch(setError(MODAL_UNLOCK, err));
	} finally {
		dispatch(toggleModalLoading(MODAL_UNLOCK, false));
	}

};

import echo, { PrivateKey } from 'echojs-lib';
import { List } from 'immutable';
import random from 'crypto-random-string';

import { openModal, toggleLoading as toggleModalLoading, setError, closeModal } from './ModalActions';
import { addAccount, isAccountAdded, initAccount, setGlobalError } from './GlobalActions';

import {
	setFormValue,
	setFormError,
	toggleLoading,
} from './FormActions';

import { FORM_SIGN_UP, FORM_SIGN_IN } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_CHOOSE_ACCOUNT, MODAL_ADD_WIF } from '../constants/ModalConstants';
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
// import { PERMISSION_TABLE } from '../constants/TableConstants';

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
		const network = getState().global.getIn(['network']).toJS();
		accountNameError = await validateAccountExist(accountName, false);

		if (isAddAccount && !accountNameError) {
			accountNameError = isAccountAdded(accountName, network.name);
		}

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
			return;
		}

		dispatch(toggleLoading(FORM_SIGN_UP, true));
		const { publicKey } = await AuthApi.registerAccount(accountName, generatedWIF);

		const userStorage = Services.getUserStorage();
		const account = await echo.api.getAccountByName(accountName);
		await userStorage.addKey(Key.create(publicKey, generatedWIF, account.id), { password });

		dispatch(addAccount(accountName, network.name));

	} catch (err) {
		dispatch(setGlobalError(formatError(err) || 'Account creation error. Please, try again later'));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
	}

};
/**
 * @method isAllWIFsAdded
 * @param {Object} account
 * @param {String} password
 * @return {Boolean}
 */
const isAllWIFsAdded = async (account, password) => {
	const userStorage = Services.getUserStorage();
	const userWIFKeys = await userStorage.getAllWIFKeysForAccount(account.id, { password });
	const userPublicKeys = account.active.key_auths;
	const accountAuth = account.active.account_auths;
	if ((userPublicKeys.length + accountAuth.length) > userWIFKeys.length) {
		return false;
	}
	return true;
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
	const userStorage = Services.getUserStorage();

	try {
		accountNameError = await validateAccountExist(accountName, true);

		if (!accountNameError) {
			const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();
			const key = await userStorage.getWIFByPublicKey(publicKey, { password });
			accountNameError = !!key && isAccountAdded(accountName, networkName);
		}

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
			return true;
		}

		dispatch(toggleLoading(FORM_SIGN_IN, true));
		const account = await echo.api.getAccountByName(accountName);

		const key = unlockWallet(account, wif);

		if (!key) {
			dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
			return false;
		}

		await userStorage.addKey(Key.create(key.publicKey, wif, account.id), { password });

		if (!isAccountAdded(accountName, networkName)) {
			dispatch(addAccount(accountName, networkName));
		} else {
			dispatch(initAccount(accountName, networkName));
		}

		const hasAllWIFs = await isAllWIFsAdded(account, password);
		if (!hasAllWIFs) {
			dispatch(openModal(MODAL_ADD_WIF));
		}
		return false;
	} catch (err) {
		dispatch(setGlobalError(formatError(err) || 'Account importing error. Please, try again later'));
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

	const asset = await echo.api.getObject(ECHO_ASSET_ID);

	accounts = accounts.map(async (acc) => {
		const account = {
			name: acc.name,
			id: acc.id,
			checked: false,
			balances: {
				symbol: asset.symbol,
				precision: asset.precision,
			},
		};

		if (acc.balances && acc.balances[ECHO_ASSET_ID]) {
			const stats = await echo.api.getObject(acc.balances[ECHO_ASSET_ID]);
			account.balances.balance = stats.balance;
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

			let [accountIDs] = await echo.api.getKeyReferences([active]);
			if (!accountIDs.length) {
				dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
				return;
			}

			const accounts = await echo.api.getFullAccounts(accountIDs);

			const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();
			const storageKey = await Services.getUserStorage().getWIFByPublicKey(publicKey, { password });

			await Promise.all(accounts.map(async (n) => {

				if (!!storageKey && isAccountAdded(n.name, networkName)) {
					accountIDs = accountIDs.filter((item) => n.id !== item);
				}
			}));

			if (accountIDs.length === 0) {
				dispatch(setGlobalError('Account already exists'));
				return;
			}

			if (accountIDs.length > 1) {
				dispatch(getAccountsList(accounts));
				return;
			}

			const account = await echo.api.getObject(accountIDs[0]);

			if (accountName && account.name !== accountName) {
				dispatch(setFormError(FORM_SIGN_IN, 'wif', 'Invalid WIF'));
				return;
			}

			dispatch(authUser({ accountName: account.name, wif, password }));
			return;

		} catch (error) {
			dispatch(setGlobalError(formatError(error) || 'Account importing error. Please, try again later'));
		}
	};

/**
 *  @method importSelectedAccounts
 *
 *  Log in selected accounts
 *
 *  @param {String} password
 *  @param {Array} accounts
 *
 */
export const importSelectedAccounts = (password, accounts) => async (dispatch, getState) => {
	const wif = getState().form.getIn([FORM_SIGN_IN, 'wif']).value;

	accounts.forEach((account) => {
		if (account.checked) {
			dispatch(authUser({ accountName: account.name, wif, password }));
		}
	});

	dispatch(closeModal(MODAL_CHOOSE_ACCOUNT));
};

export const unlock = (password, callback = () => { }, modal = MODAL_UNLOCK) =>
	async (dispatch) => {
		try {
			dispatch(toggleModalLoading(modal, true));

			const userStorage = Services.getUserStorage();
			const doesDBExist = await userStorage.doesDBExist();

			if (!doesDBExist) {
				dispatch(setError(modal, 'DB doesn\'t exist'));
				return;
			}

			await userStorage.setScheme(USER_STORAGE_SCHEMES.MANUAL, password);
			const correctPassword = await userStorage.isMasterPassword(password);

			if (!correctPassword) {
				dispatch(setError(modal, 'Invalid password'));
				return;
			}

			dispatch(closeModal(modal));

			callback(password);
		} catch (err) {
			dispatch(setError(modal, err));
		} finally {
			dispatch(toggleModalLoading(modal, false));
		}

	};

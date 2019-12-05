import echo, { PrivateKey } from 'echojs-lib';
import { List } from 'immutable';
import random from 'crypto-random-string';

import { openModal, toggleLoading as toggleModalLoading, setError, closeModal } from './ModalActions';
import { addAccount, isAccountAdded, initAccount, setGlobalError, saveWifToStorage, updateStorage } from './GlobalActions';

import {
	setFormValue,
	setFormError,
	toggleLoading,
} from './FormActions';

import { FORM_SIGN_UP, FORM_SIGN_IN } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_CHOOSE_ACCOUNT, MODAL_ADD_WIF, PROPOSAL_ADD_WIF } from '../constants/ModalConstants';
import { ECHO_ASSET_ID, RANDOM_SIZE, USER_STORAGE_SCHEMES } from '../constants/GlobalConstants';

import { formatError } from '../helpers/FormatHelper';
import { validateAccountName, validateWIF, isPublicKey } from '../helpers/ValidateHelper';

import {
	validateAccountExist,
	unlockWallet,
	getKeyFromWif,
} from '../api/WalletApi';
import AuthApi from '../api/AuthApi';

import Services from '../services';
import Key from '../logic-components/db/models/key';
import CryptoService from '../services/CryptoService';
import { checkKeyWeightWarning } from './BalanceActions';

/**
 * @method generateWIF
 * @returns {function(dispatch): Promise<undefined>}
 */
export const generateWIF = () => (dispatch) => {
	const privateKey = PrivateKey.fromSeed(random({ length: RANDOM_SIZE }));

	dispatch(setFormValue(FORM_SIGN_UP, 'generatedWIF', privateKey.toWif()));
};

/**
 * @method createAccount
 * @param {Object} param0
 * @param {Boolean} isAddAccount
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const createAccount = ({
	accountName, generatedWIF, confirmWIF, password,
}, isAddAccount, isCustomSettings) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);
	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
		return;
	}

	if (isCustomSettings) {
		let isValidPub = true;
		let isValidWif = true;
		const userPublicKey = getState().form.getIn([FORM_SIGN_UP, 'userPublicKey']);
		if (userPublicKey.value) {
			isValidPub = isPublicKey(userPublicKey.value);
		}
		if (generatedWIF.value) {
			try {
				PrivateKey.fromWif(generatedWIF.value).toPublicKey().toString();
			} catch (e) {
				isValidWif = false;
				dispatch(setFormError(FORM_SIGN_UP, 'userWIF', 'Invalid WIF'));
			}
		}
		if (!isValidPub) {
			dispatch(setFormError(FORM_SIGN_UP, 'userPublicKey', 'Invalid public key'));
			return;
		}
		if (!isValidPub || !isValidWif) {
			return;
		}
	}
	if (!isCustomSettings) {
		let confirmWIFError = validateWIF(confirmWIF);
		if (generatedWIF !== confirmWIF) {
			confirmWIFError = 'WIFs do not match';
		}
		if (confirmWIFError) {
			dispatch(setFormError(FORM_SIGN_UP, 'confirmWIF', confirmWIFError));
			return;
		}
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

		let pubKey;
		const isWithoutWIFRegistr = isCustomSettings && !getState().form.getIn([FORM_SIGN_UP, 'userWIF']).value;
		const userStorage = Services.getUserStorage();
		if (isWithoutWIFRegistr) {
			pubKey = getState().form.getIn([FORM_SIGN_UP, 'userPublicKey']).value;
			await AuthApi.registerAccountViaPublicKey(accountName, pubKey);
		} else {
			pubKey = (await AuthApi.registerAccount(accountName, generatedWIF)).publicKey;
		}
		const account = await echo.api.getAccountByName(accountName);

		if (!isWithoutWIFRegistr) {
			await userStorage.addKey(Key.create(pubKey, generatedWIF, account.id, 'active'), { password });
			await userStorage.addKey(Key.create(pubKey, generatedWIF, account.id, 'echoRand'), { password });
		}

		dispatch(addAccount(
			accountName,
			network.name,
			[[pubKey, { active: !isWithoutWIFRegistr, echoRand: !isWithoutWIFRegistr }]],
		));
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

/**
 * @method authUser
 *
 * @param {Object} param0
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
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

		const keyAndType = [key.publicKey, {
			active: true,
			echoRand: key.publicKey === account.echorand_key,
		}];

		await userStorage.addKey(Key.create(key.publicKey, wif, account.id, 'active'), { password });

		if (keyAndType[1].echoRand) {
			await userStorage.addKey(Key.create(key.publicKey, wif, account.id, 'echoRan'), { password });
		}

		if (!isAccountAdded(accountName, networkName)) {
			dispatch(addAccount(accountName, networkName, [keyAndType]));
		} else {
			dispatch(initAccount(accountName, networkName));
		}

		const hasWifWarning = await dispatch(checkKeyWeightWarning(networkName, account.id));
		if (hasWifWarning) {
			dispatch(openModal(PROPOSAL_ADD_WIF));
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
 * 	@@returns {function(dispatch): Promise<Object>}
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
 *  @param {String} wif
 *	@returns {function(dispatch, getState): Promise<undefined>}
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
 *  @returns {function(dispatch, getState): Promise<undefined>}
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

/**
 * @method unlock
 * @param {String} password
 * @param {Function} callback
 * @param {String} modal
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
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
			dispatch(setError(modal, err.message));
		} finally {
			dispatch(toggleModalLoading(modal, false));
		}

	};

export const asyncUnlock = (
	password,
	callback = () => { },
	modal = MODAL_UNLOCK,
) => async (dispatch) => {
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

		await callback(password);

		dispatch(closeModal(modal));
	} catch (err) {
		dispatch(setError(modal, err));
	} finally {
		dispatch(toggleModalLoading(modal, false));
	}

};

export const editWifs = (keysData, account, password) => async (dispatch, getState) => {
	const { id, name } = account;
	const networkName = getState().global.getIn(['network', 'name']);
	const userStorage = Services.getUserStorage();
	const keys = keysData.map((keyData) => {
		const { publicKey, wif, type } = keyData;

		if (!CryptoService.isWIF(wif)) {
			throw Error('Invalid WIF');
		}

		const privateKey = PrivateKey.fromWif(wif);

		if (publicKey !== privateKey.toPublicKey().toPublicKeyString()) {
			throw Error('Wrong WIF');
		}
		return Key.create(publicKey, wif, id, type);
	});

	await userStorage.updateKeys(keys, { password, accountId: id });
	dispatch(updateStorage(name, networkName, keys));
};

export const saveWifToDb = (
	publicKey,
	wif,
	account,
	password,
	type,
	callback = () => { },
	modal = MODAL_ADD_WIF,
) => async (dispatch, getState) => {
	try {
		const { id, name } = account;
		const networkName = getState().global.getIn(['network', 'name']);
		const userStorage = Services.getUserStorage();
		if (!CryptoService.isWIF(wif)) {
			dispatch(setError(modal, 'Invalid WIF'));
			return;
		}

		const privateKey = PrivateKey.fromWif(wif);

		if (publicKey !== privateKey.toPublicKey().toPublicKeyString()) {
			dispatch(setError(modal, 'Wrong WIF'));
			return;
		}
		await userStorage.addKey(Key.create(publicKey, wif, id, type), { password });

		dispatch(saveWifToStorage(name, networkName, publicKey, type));
		callback();
		dispatch(closeModal(modal));
	} catch (err) {
		dispatch(setError(modal, err));
	} finally {
		dispatch(toggleModalLoading(modal, false));
	}
};

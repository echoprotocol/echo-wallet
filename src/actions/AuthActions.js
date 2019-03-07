import { key, PrivateKey } from 'echojs-lib';
import { EchoJSActions, ChainStore } from 'echojs-redux';

import { setFormValue, setFormError, toggleLoading, setValue, clearForm } from './FormActions';
import { closeModal, openModal, setDisable } from './ModalActions';
import { set as setKey } from './KeyChainActions';
import { addAccount, isAccountAdded } from './GlobalActions';
import { setField, setNote } from './TransactionActions';
import { update } from './TableActions';


import {
	FORM_SIGN_UP,
	FORM_SIGN_IN,
	FORM_UNLOCK_MODAL,
	FORM_TRANSFER,
} from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';
import { PERMISSION_TABLE } from '../constants/TableConstants';

import { validateAccountName, validatePassword } from '../helpers/ValidateHelper';

import {
	validateAccountExist,
	unlockWallet,
	generateKeyFromPassword,
	getKeyFromWif,
} from '../api/WalletApi';
import { decodeMemo } from '../api/TransactionApi';
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
			owner, active, memo, echoRandKey,
		} = await AuthApi.registerAccount(
			instance,
			accountName,
			generatedPassword,
		);

		dispatch(setKey(owner, accountName, generatedPassword, 'owner'));
		dispatch(setKey(active, accountName, generatedPassword, 'active'));
		dispatch(setKey(memo, accountName, generatedPassword, 'memo'));
		dispatch(setKey(echoRandKey, accountName, generatedPassword, 'echoRand'));

		dispatch(addAccount(accountName, network.name));

	} catch (err) {
		dispatch(setValue(FORM_SIGN_UP, 'error', err));
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
			return false;
		}

		dispatch(toggleLoading(FORM_SIGN_IN, true));

		const account = await dispatch(EchoJSActions.fetch(accountName));

		const { owner, active, memo } = unlockWallet(account, password);

		if (!owner && !active && !memo) {
			dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
			return false;
		}

		if (owner) {
			dispatch(setKey(owner, accountName, password, 'owner'));
		}

		if (active) {
			dispatch(setKey(active, accountName, password, 'active'));
		}

		if (memo) {
			dispatch(setKey(memo, accountName, password, 'memo'));
		}

		dispatch(addAccount(accountName, networkName));
		return true;
	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'error', err));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_IN, false));
	}
	return false;

};

/**
 *  @method importAccount
 *
 * 	Import account from bridge app or sign in
 *
 * 	@param {Object}
 *
 */
export const importAccount = ({ accountName, password }) =>
	async (dispatch) => {

		if (accountName) {
			const added = await dispatch(authUser({ accountName, password }));
			if (added) {
				return;
			}
		}
		if (getKeyFromWif(password)) {

			const active = PrivateKey.fromWif(password).toPublicKey().toString();
			try {
				const accountIDs = await ChainStore.FetchChain('getAccountRefsOfKey', active);
				if (!accountIDs.size) {
					dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
					return;
				}

				const account = await ChainStore.FetchChain('getAccount', accountIDs.toArray()[0]);

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

export const signTransaction = (owner, active, memo) => (dispatch, getState) => {
	const { options, keys } = getState().transaction.toJS();

	if (options && !keys) {
		dispatch(setField('keys', {
			owner: owner ? owner.privateKey : owner,
			active: active ? active.privateKey : active,
			memo: memo ? memo.privateKey : memo,
		}));

		if (options.memo && !memo) {
			dispatch(setFormError(FORM_TRANSFER, 'note', 'Note permission is required'));
			return;
		}

		dispatch(openModal(MODAL_DETAILS));
	}
};

export const showNote = (memo) => (dispatch, getState) => {
	const { note } = getState().transaction.toJS();

	if (note.value && !note.unlocked) {
		try {
			const decodedNote = decodeMemo(note.value, memo.privateKey);
			dispatch(setNote({
				note: decodedNote,
				unlocked: true,
				error: null,
			}));
		} catch (err) {
			dispatch(setNote({ error: err }));
		}
	}
};

export const showPermissions = (
	accountName,
	password,
	permissionKey,
) => async (dispatch, getState) => {
	const { type, role } = getState().table.getIn([PERMISSION_TABLE, 'permissionKey']);

	if (!permissionKey) { return; }

	const param = permissionKey;

	if (role === 'memo' || type === 'keys') permissionKey = accountName;

	let privateKey = getKeyFromWif(password);
	let publicKey;

	if (privateKey) {
		publicKey = privateKey.toPublicKey().toString();
	} else {
		({ privateKey, publicKey } = generateKeyFromPassword(permissionKey, role, password));
	}

	const targetAccount = (await dispatch(EchoJSActions.fetch(permissionKey))).toJS();

	let publicKeyError = null;

	if (role !== 'memo') {
		if (type === 'accounts') {
			publicKeyError = !targetAccount[role].key_auths.find((k) => k[0] === publicKey) ?
				'Invalid password for account' : null;
		} else {
			publicKeyError = param !== publicKey ? 'Invalid password for key' : null;
		}
	} else if (targetAccount.options.memo_key !== publicKey) publicKeyError = 'Invalid password for note key';

	if (publicKeyError) {
		dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', publicKeyError));
		return;
	}

	const value = {
		privateKey: privateKey ? privateKey.toWif() : '',
		unlocked: true,
	};

	dispatch(update(PERMISSION_TABLE, [role, type], param, value));
	dispatch(closeModal(MODAL_UNLOCK));
	dispatch(clearForm(FORM_UNLOCK_MODAL));

};

export const unlockAccount = (account, password) => (dispatch) => {

	try {
		dispatch(setDisable(MODAL_UNLOCK, true));

		const passwordError = validatePassword(password);

		if (passwordError) {
			// dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', passwordError));
			return { error: passwordError };
		}

		const keys = unlockWallet(account, password);

		// const { key: permissionKey } = getState().table.getIn([PERMISSION_TABLE, 'permissionKey']);

		if (!keys.owner && !keys.active && !keys.memo) { // && !permissionKey
			// dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', 'Invalid password'));
			return { error: 'Invalid password' };
		}

		Object.entries(keys).forEach(([role, value]) => {
			dispatch(setKey(value, account.get('name'), password, role));
		});

		// dispatch(signTransaction(owner, active, memo));
		//
		// dispatch(showNote(memo));
		//
		// dispatch(showPermissions(account.get('name'), password, permissionKey));
		//
		// if (!permissionKey) {
		// 	dispatch(closeModal(MODAL_UNLOCK));
		// 	dispatch(clearForm(FORM_UNLOCK_MODAL));
		// }

		return { keys };
	} catch (err) {
		return { error: err instanceof Error ? err.message : err };
		// dispatch(setValue(FORM_UNLOCK_MODAL, 'error', err));
	} finally {
		dispatch(setDisable(MODAL_UNLOCK, false));
	}

};

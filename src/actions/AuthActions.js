import { key } from 'echojs-lib';
import { EchoJSActions } from 'echojs-redux';

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
	createWallet,
	unlockWallet,
	generateKeyFromPassword,
	getKeyFromWif,
} from '../api/WalletApi';
import { decodeMemo } from '../api/TransactionApi';

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

		const { owner, active, memo } = await createWallet(
			network.registrator,
			accountName,
			generatedPassword,
		);

		dispatch(setKey(owner, accountName, generatedPassword, 'owner'));
		dispatch(setKey(active, accountName, generatedPassword, 'active'));
		dispatch(setKey(memo, accountName, generatedPassword, 'memo'));

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
		return;
	}

	if (passwordError) {
		dispatch(setFormError(FORM_SIGN_IN, 'password', passwordError));
		return;
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
			return;
		}

		dispatch(toggleLoading(FORM_SIGN_IN, true));

		const account = await dispatch(EchoJSActions.fetch(accountName));

		const { owner, active, memo } = await unlockWallet(account, password);

		if (!owner && !active && !memo) {
			dispatch(setFormError(FORM_SIGN_IN, 'password', 'Invalid password'));
			return;
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

	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'error', err));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_IN, false));
	}

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

export const unlockAccount = ({
	accountName,
	password,
}) => async (dispatch, getState) => {

	try {
		dispatch(setDisable(MODAL_UNLOCK, true));

		const passwordError = validatePassword(password);

		if (passwordError) {
			dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', passwordError));
			return;
		}

		const account = await dispatch(EchoJSActions.fetch(accountName));

		const { owner, active, memo } = await unlockWallet(account, password);

		const { key: permissionKey } = getState().table.getIn([PERMISSION_TABLE, 'permissionKey']);

		if (!owner && !active && !memo && !permissionKey) {
			dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', 'Invalid password'));
			return;
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

		dispatch(signTransaction(owner, active, memo));

		dispatch(showNote(memo));

		dispatch(showPermissions(accountName, password, permissionKey));

		if (!permissionKey) {
			dispatch(closeModal(MODAL_UNLOCK));
			dispatch(clearForm(FORM_UNLOCK_MODAL));
		}

	} catch (err) {
		dispatch(setValue(FORM_UNLOCK_MODAL, 'error', err));
	} finally {
		dispatch(setDisable(MODAL_UNLOCK, false));
	}

};

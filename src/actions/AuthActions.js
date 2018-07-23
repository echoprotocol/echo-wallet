import { key } from 'echojs-lib';

import { setFormValue, setFormError, toggleLoading, setValue, clearForm } from './FormActions';
import { closeModal } from './ModalActions';
import { set as setKey } from './KeyChainActions';
import { fetchAccount, setGlobal } from './GlobalActions';

import { FORM_SIGN_UP, FORM_SIGN_IN, FORM_UNLOCK_MODAL } from '../constants/FormConstants';
import { MODAL_UNLOCK } from '../constants/ModalConstants';

import { validateAccountName, validatePassword } from '../helpers/AuthHelper';

import { validateAccountExist, createWallet, unlockWallet } from '../api/WalletApi';

export const generatePassword = () => (dispatch) => {
	const generatedPassword = (`P${key.get_random_key().toWif()}`).substr(0, 45);

	dispatch(setFormValue(FORM_SIGN_UP, 'generatedPassword', generatedPassword));
};

export const createAccount = ({
	accountName,
	generatedPassword,
	confirmPassword,
}) => async (dispatch, getState) => {
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
		const instance = getState().echojs.getIn(['echojs', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, false);

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_UP, 'accountName', accountNameError));
			return;
		}

		dispatch(toggleLoading(FORM_SIGN_UP, true));

		const { owner, active, memo } = await createWallet(accountName, generatedPassword);

		dispatch(setKey(owner, accountName, generatedPassword, 'owner'));
		dispatch(setKey(active, accountName, generatedPassword, 'active'));
		dispatch(setKey(memo, accountName, generatedPassword, 'memo'));

		const user = await dispatch(fetchAccount(accountName));

		const field = 'currentlyUserId';
		const value = user.get('id');

		dispatch(setGlobal({ field, value }));

	} catch (err) {
		dispatch(setValue(FORM_SIGN_UP, 'error', err));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
	}

};

export const authUser = ({
	accountName,
	password,
}) => async (dispatch, getState) => {
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

	try {
		const instance = getState().echojs.getIn(['echojs', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
			return;
		}

		dispatch(toggleLoading(FORM_SIGN_IN, true));

		const { owner, active, memo } = await unlockWallet(accountName, password);

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

		const user = await dispatch(fetchAccount(accountName));

		const field = 'currentlyUserId';
		const value = user.get('id');

		dispatch(setGlobal({ field, value }));

	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'error', err));
	} finally {
		dispatch(toggleLoading(FORM_SIGN_IN, false));
	}

};

export const unlockAccount = ({
	accountName,
	password,
}) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);
	const passwordError = validatePassword(password);

	if (accountNameError) {
		dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
		return;
	}

	if (passwordError) {
		dispatch(setFormError(FORM_UNLOCK_MODAL, 'password', passwordError));
		return;
	}

	try {
		const instance = getState().echojs.getIn(['echojs', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
			return;
		}
		dispatch(toggleLoading(FORM_UNLOCK_MODAL, true));

		const { owner, active, memo } = await unlockWallet(accountName, password);

		if (!owner && !active && !memo) {
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

		dispatch(closeModal(MODAL_UNLOCK));
		dispatch(clearForm(FORM_UNLOCK_MODAL));

	} catch (err) {
		dispatch(setValue(FORM_UNLOCK_MODAL, 'error', err));
	} finally {
		dispatch(toggleLoading(FORM_UNLOCK_MODAL, false));
	}

};

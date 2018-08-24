import { key } from 'echojs-lib';
import { EchoJSActions } from 'echojs-redux';

import { setFormValue, setFormError, toggleLoading, setValue, clearForm } from './FormActions';
import { closeModal, openModal, setDisable } from './ModalActions';
import { set as setKey } from './KeyChainActions';
import { initAccount } from './GlobalActions';
import { setField, setComment } from './TransactionActions';

import { FORM_SIGN_UP, FORM_SIGN_IN, FORM_UNLOCK_MODAL } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';

import { validateAccountName, validatePassword } from '../helpers/ValidateHelper';

import { validateAccountExist, createWallet, unlockWallet } from '../api/WalletApi';
import { decodeMemo } from '../api/TransactionApi';

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
		const instance = getState().echojs.getIn(['system', 'instance']);
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

		dispatch(initAccount(accountName));
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
		const instance = getState().echojs.getIn(['system', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

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

		dispatch(initAccount(accountName));
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

	try {
		dispatch(setDisable(MODAL_UNLOCK, true));

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

		const instance = getState().echojs.getIn(['system', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

		if (accountNameError) {
			dispatch(setFormError(FORM_SIGN_IN, 'accountName', accountNameError));
			return;
		}

		const account = await dispatch(EchoJSActions.fetch(accountName));

		const { owner, active, memo } = await unlockWallet(account, password);

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

		const { options, keys, comment } = getState().transaction.toJS();
		if (options && !keys) {
			dispatch(setField('keys', {
				owner: owner.privateKey,
				active: active.privateKey,
				memo: memo.privateKey,
			}));

			dispatch(openModal(MODAL_DETAILS));
		}

		if (comment.value && !comment.unlocked) {
			try {
				const decodedComment = decodeMemo(comment.value, memo.privateKey);
				dispatch(setComment({
					comment: decodedComment,
					unlocked: true,
					error: null,
				}));
			} catch (err) {
				dispatch(setComment({ error: err }));
			}
		}

		dispatch(closeModal(MODAL_UNLOCK));
		dispatch(clearForm(FORM_UNLOCK_MODAL));

	} catch (err) {
		dispatch(setValue(FORM_UNLOCK_MODAL, 'error', err));
	} finally {
		dispatch(setDisable(MODAL_UNLOCK, false));
	}

};

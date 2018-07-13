import { key } from 'echojs-lib';

import { setFormValue, setFormError, toggleLoading, setValue } from './FormActions';

import { FORM_SIGN_UP } from '../constants/FormConstants';

import { validateAccountName, validatePassword } from '../helpers/AuthHelper';

import { createWallet } from '../api/WalletApi';

export const generatePassword = () => (dispatch) => {
	const generatedPassword = (`P${key.get_random_key().toWif()}`).substr(0, 45);

	dispatch(setFormValue(FORM_SIGN_UP, 'generatedPassword', generatedPassword));
};

export const createAccount = ({
	accountName,
	generatedPassword,
	confirmPassword,
}) => (dispatch) => {
	const accountNameError = validateAccountName(accountName);
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

	dispatch(toggleLoading(FORM_SIGN_UP, true));

	createWallet(accountName, generatedPassword).then(() => {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
	}).catch((err) => {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
		dispatch(setValue(FORM_SIGN_UP, 'error', err));
	});

};

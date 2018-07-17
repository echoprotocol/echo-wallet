import { ChainValidation } from 'echojs-lib';

export const validateAccountName = (accountName) => {
	if (!accountName) { return 'Account name should not be empty'; }

	if (ChainValidation.is_account_name_error(accountName)) {
		return ChainValidation.is_account_name_error(accountName);
	}

	if (!ChainValidation.is_cheap_name(accountName)) {
		return 'Enter a name containing least one dash, a number or no vowels';
	}

	return null;
};

export const validatePassword = (password) => {
	if (!password) { return 'Password should not be empty'; }

	if (password.length !== 0 && password.length < 8) {
		return 'Password must be 8 characters or more';
	}

	return null;
};

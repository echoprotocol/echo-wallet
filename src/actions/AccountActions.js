import Services from '../services';
import { validateAccountExist } from '../api/WalletApi';
import {
	setFormError,
	setValue,
	setIn,
} from './FormActions';
import { formatError } from '../helpers/FormatHelper';

export const updateAccountAddresses = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await Services.getEcho().api.getAccountAddresses(activeUserId, 0, 100000);

	return true;
};

export const getBtcAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await Services.getEcho().api.getBtcAddress(activeUserId);

	return true;
};

/**
 *
 * @param name
 * @returns {Promise<Array<[string, string]>>}
 */
export const lookupAccountsList = async (name, limit = 15) => {
	const list = await Services.getEcho().api.lookupAccounts(name, limit);
	return list;
};


/**
 * @method checkAccount
 *
 * @param {String} accountName
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const checkAccount = (form, account, subject, byId) => async (dispatch) => {
	try {
		if (!account) return false;
		const accountError = await validateAccountExist(account, true, 50, byId);

		if (accountError) {
			dispatch(setFormError(form, subject, accountError));
			return false;
		}

		dispatch(setIn(form, subject, {
			checked: true,
			error: null,
		}));

	} catch (err) {
		dispatch(setValue(form, 'error', formatError(err)));
	} finally {
		dispatch(setIn(form, subject, { loading: false }));
	}
	return true;
};

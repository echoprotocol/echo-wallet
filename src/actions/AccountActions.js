import echo from 'echojs-lib';

export const updateAccountAddresses = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await echo.api.getAccountAddresses(activeUserId, 0, 100000);

	return true;
};

export const getBtcAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await echo.api.getBtcAddress(activeUserId);

	return true;
};

/**
 *
 * @param name
 * @returns {Promise<Array<[string, string]>>}
 */
export const lookupAccountsList = async (name, limit = 15) => {
	const list = await echo.api.lookupAccounts(name, limit);
	return list;
};


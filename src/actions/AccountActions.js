import echo from 'echojs-lib';

export const updateAccountAddresses = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await echo.api.getAccountAddresses(activeUserId, 0, 100000);

	return true;
};

import echo from 'echojs-lib';

export const getEthAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await echo.api.getEthAddress(activeUserId);

	await echo.api.getFullAccounts([activeUserId]);

	return true;
};

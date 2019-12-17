import echo from 'echojs-lib';
import Services from '../services';

export const getEthAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await Services.getEcho().api.getEthAddress(activeUserId);
	// await echo.api.getEthAddress(activeUserId);

	await Services.getEcho().api.getFullAccounts([activeUserId]);
	// await echo.api.getFullAccounts([activeUserId]);

	return true;
};

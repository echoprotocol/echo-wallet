import Services from '../services';

export const getEthAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await Services.getEcho().api.getEthAddress(activeUserId);

	await Services.getEcho().api.getFullAccounts([activeUserId]);

	return true;
};

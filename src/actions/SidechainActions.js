import Services from '../services';
import { getEthContractLogs } from '../services/ApiService';

export const getEthAddress = () => async (dispatch, getState) => {

	const globalParameters = await Services.getEcho().api.getGlobalProperties();
	const { eth_contract_address } = globalParameters.sidechain_config
	await getEthContractLogs();

	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	await Services.getEcho().api.getEthAddress(activeUserId);

	await Services.getEcho().api.getFullAccounts([activeUserId]);

	return true;
};

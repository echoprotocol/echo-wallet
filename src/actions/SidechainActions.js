import GlobalReducer from '../reducers/GlobalReducer';

import Services from '../services';
import { callContract } from '../services/ApiService';

import { getUintFromDecimal, getAddressFromDecimal, add0x } from '../helpers/ContractHelper';

import { SIDE_CHAIN_HASHES } from '../constants/GlobalConstants';

const getSidechainEthAddress = async (activeUserId) => {
	const globalParameters = await Services.getEcho().api.getGlobalProperties();

	const { sidechain_config: sidechainConfig } = globalParameters.parameters;

	const sidechainContractAddress = add0x(sidechainConfig.eth_contract_address);
	const userIdWithoutPrefix = activeUserId.split('.')[2];
	const bytecode = add0x(SIDE_CHAIN_HASHES['recipientAddress(uint64)'], getUintFromDecimal(userIdWithoutPrefix));
	const zeroAddress = add0x(getAddressFromDecimal(0));
	const params = { sender: zeroAddress, amount: 0, bytecode };

	const response = await callContract(sidechainContractAddress, params);

	return response;
};

const getSidechainEthereumAddress = () => async (dispatch, getState) => {
	const ethereumSidechainAddress = getState().global.getIn(['ethSidechain', 'address']);
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (ethereumSidechainAddress) {
		return ethereumSidechainAddress;
	}

	try {
		const response = await getSidechainEthAddress(activeUserId);
		const zeroAddress = add0x(getAddressFromDecimal(0, true));

		return response === zeroAddress ? '' : add0x(response.slice(26));
	} catch (error) {
		return '';
	}
};

export const getEthAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const { eth_addr: ethAddress, is_approved: isApproved } = await Services.getEcho().api.getEthAddress(activeUserId) || {};

	const [fullCurrentAccount] = await Services.getEcho().api.getFullAccounts([activeUserId]);

	if (!fullCurrentAccount) {
		return true;
	}

	if (!fullCurrentAccount.statistics.created_eth_address) {
		return true;
	}

	if (ethAddress && isApproved) {
		dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params: { address: ethAddress, confirmed: true } }));
		Interval.stopInterval();
		return true;
	}

	const ethereumSidechainAddress = await dispatch(getSidechainEthereumAddress());
	if (!ethereumSidechainAddress) {
		return true;
	}

	const params = { address: ethereumSidechainAddress, confirmed: isApproved };
	dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params }));

	return true;
};

// export const getEthAddress = () => async (dispatch, getState) => {
// 	const activeUserId = getState().global.getIn(['activeUser', 'id']);
//
// 	if (!activeUserId) {
// 		return;
// 	}
//
// 	const { eth_addr: ethAddress, is_approved: isApproved } = await Services.getEcho().api.getEthAddress(activeUserId) || {};
//
// 	if (ethAddress && isApproved) {
// 		dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params: { address: ethAddress, confirmed: true } }));
// 		return;
// 	}
//
// 	if (ethAddress) {
// 		dispatch(GlobalReducer.actions.setIn({
// 			field: 'ethSidechain', params: { address: ethAddress, confirmed: false }
// 		}));
// 		return;
// 	}
//
// 	// const ethereumSidechainAddress = await dispatch(getSidechainEthereumAddress());
// 	// if (!ethereumSidechainAddress) {
// 	// 	return true;
// 	// }
// 	//
// 	// const params = { address: ethereumSidechainAddress, confirmed: isApproved };
// 	// dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params }));
//
// 	return true;
// };

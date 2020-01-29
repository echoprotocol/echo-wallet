import GlobalReducer from '../reducers/GlobalReducer';
import BN from 'bignumber.js';

import Services from '../services';
import { callContract, getEthContractLogs, getEthNetworkInformation } from '../services/ApiService';
import { getUintFromDecimal, getAddressFromDecimal } from '../helpers/ContractHelper';
import { SIDE_CHAIN_HASHES } from '../constants/GlobalConstants';

const getSidechainEthAddress = async (activeUserId) => {
	const globalParameters = await Services.getEcho().api.getGlobalProperties();

	const { sidechain_config: sidechainConfig } = globalParameters.parameters;

	const sidechainContractAddress = `0x${sidechainConfig.eth_contract_address}`;
	const userIdWithoutPrefix = activeUserId.split('.')[2];
	const bytecode = `0x${SIDE_CHAIN_HASHES['recipientAddress(uint64)']}${getUintFromDecimal(userIdWithoutPrefix)}`;
	const zeroAddress = `0x${getAddressFromDecimal(0)}`;
	const params = { sender: zeroAddress, amount: 0, bytecode };

	const response = await callContract(sidechainContractAddress, params);

	return response;
};

const getSidechainEthereumAddress = () => async (dispatch, getState) => {
	const ethereumSidechainAddress = getState().global.getIn(['activeUser', 'ethereumSidechainAddress']);
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (ethereumSidechainAddress) {
		return ethereumSidechainAddress;
	}

	try {
		const response = await getSidechainEthAddress(activeUserId);
		const zeroAddress = `0x${getAddressFromDecimal(0, true)}`;

		return response === zeroAddress ? '' : `0x${response.slice(26)}`;
	} catch (error) {
		return '';
	}
};

const getCurrentSidechainEthBlock = async () => {
	try {
		const { last_block: lastBlock } = await getEthNetworkInformation();
		return lastBlock;
	} catch (error) {
		return 0;
	}
};

const getEthSidechainGenerateAddressLogs = async ({
	fromBlock = 0,
	toBlock = 20,
	addresses = [],
	topics = [],
}) => {
	try {
		// const logs = await getEthContractLogs({
		// 	from_block: fromBlock,
		// 	to_block: toBlock,
		// 	topics,
		// 	addresses,
		// });

		// return logs;

		return [];
	} catch (error) {
		return [];
	}

};

const checkAddressCreationConfirm = async (blocksToConfirm = 20, idToSearch) => {
	const lastEthSidechainBlock = await getCurrentSidechainEthBlock();

	if (!lastEthSidechainBlock) {
		return false;
	}

	if (new BN(lastEthSidechainBlock).lte(blocksToConfirm)) {
		return false;
	}

	const globalParameters = await Services.getEcho().api.getGlobalProperties();

	const { sidechain_config: sidechainConfig } = globalParameters.parameters;

	const sidechainGenerateAddressTopic = `0x${sidechainConfig.eth_gen_address_topic}`;
	const sidechainContractAddress = `0x${sidechainConfig.eth_contract_address}`;

	const logs = await getEthSidechainGenerateAddressLogs({
		fromBlock: new BN(lastEthSidechainBlock).minus(blocksToConfirm).toNumber(),
		toBlock: new BN(lastEthSidechainBlock).toNumber(),
		addresses: [sidechainContractAddress],
		topics: [sidechainGenerateAddressTopic],
	});
	const userIdWithoutPrefix = idToSearch.split('.')[2];
	const userIdInUint = getUintFromDecimal(userIdWithoutPrefix);
	return false;
	return !logs.find(({ data }) => data.slice(0, 64) === userIdInUint);
};

export const getEthAddress = () => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const ethAddress = await Services.getEcho().api.getEthAddress(activeUserId);

	const [fullCurrentAccount] = await Services.getEcho().api.getFullAccounts([activeUserId]);

	if (!fullCurrentAccount) {
		return true;
	}

	if (!fullCurrentAccount.statistics.created_eth_address) {
		return true;
	}

	if (ethAddress && ethAddress.eth_addr && ethAddress.is_approved) {
		return true;
	}

	const ethereumSidechainAddress = await dispatch(getSidechainEthereumAddress());
	console.log('ethereumSidechainAddress ', ethereumSidechainAddress);
	
	if (!ethereumSidechainAddress) {
		return true;
	}

	const isAddressConfirmed = await checkAddressCreationConfirm(20, activeUserId);

	const params = { address: ethereumSidechainAddress, confirmed: isAddressConfirmed };
	dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params }));


	// if log found create setInterval to check this method again until page was closed or method return false
	// this will be mean that in close range blocks (default if 20) transactions not exist and address was created
	// earle


	return true;
};

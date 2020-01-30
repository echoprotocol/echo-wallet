import BN from 'bignumber.js';

import GlobalReducer from '../reducers/GlobalReducer';

import Services from '../services';
import { callContract, getEthContractLogs, getEthNetworkInformation } from '../services/ApiService';

import { getUintFromDecimal, getAddressFromDecimal, add0x, trim0xFomCode } from '../helpers/ContractHelper';
import Interval from '../helpers/Interval';

import { SIDE_CHAIN_HASHES } from '../constants/GlobalConstants';
import { BLOCKS_TO_CONFIRM } from '../constants/SidechainConstants';

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

const getCurrentSidechainEthBlock = async () => {
	const { last_block: lastBlock } = await getEthNetworkInformation();
	return lastBlock;
};

const getEthSidechainGenerateAddressLogs = async ({
	fromBlock = 0,
	toBlock = 20,
	addresses = [],
	topics = [],
}) => {
	const requestAddresses = addresses.map((a) => a.toLowerCase()).join(',');
	const requestTopics = topics.map((a) => a.toLowerCase()).join(',');

	const logs = await getEthContractLogs({
		from_block: fromBlock,
		to_block: toBlock,
		addresses: requestAddresses,
		topics: requestTopics,
	});

	return logs;

};

const checkAddressCreationConfirm = async (blocksToConfirm = 20, idToSearch) => {
	try {
		const lastEthSidechainBlock = await getCurrentSidechainEthBlock();

		if (!lastEthSidechainBlock) {
			return false;
		}

		if (new BN(lastEthSidechainBlock).lte(blocksToConfirm)) {
			return false;
		}

		const globalParameters = await Services.getEcho().api.getGlobalProperties();

		const { sidechain_config: sidechainConfig } = globalParameters.parameters;

		const sidechainGenerateAddressTopic = add0x(sidechainConfig.eth_gen_address_topic);
		const sidechainContractAddress = add0x(sidechainConfig.eth_contract_address);

		const logs = await getEthSidechainGenerateAddressLogs({
			fromBlock: new BN(lastEthSidechainBlock).minus(blocksToConfirm).toNumber(),
			toBlock: new BN(lastEthSidechainBlock).toNumber(),
			addresses: [sidechainContractAddress],
			topics: [sidechainGenerateAddressTopic],
		});

		const userIdWithoutPrefix = idToSearch.split('.')[2];
		const userIdInUint = getUintFromDecimal(userIdWithoutPrefix);

		return !logs.find(({ data }) => trim0xFomCode(data).slice(2, 66) === userIdInUint);
	} catch (error) {
		return false;
	}
};

export const getEthAddress = () => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const ethAddress = await Services.getEcho().api.getEthAddress(activeUserId) || {};

	const [fullCurrentAccount] = await Services.getEcho().api.getFullAccounts([activeUserId]);

	if (!fullCurrentAccount) {
		return true;
	}

	if (!fullCurrentAccount.statistics.created_eth_address) {
		return true;
	}

	if (ethAddress.eth_addr && ethAddress.is_approved) {
		dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params: { address: '', confirmed: false } }));
		Interval.stopInterval();
		return true;
	}

	const ethereumSidechainAddress = await dispatch(getSidechainEthereumAddress());
	if (!ethereumSidechainAddress) {
		return true;
	}

	// const isAddressConfirmed = await checkAddressCreationConfirm(BLOCKS_TO_CONFIRM, activeUserId);

	const params = { address: ethereumSidechainAddress, confirmed: ethAddress.is_approved };
	dispatch(GlobalReducer.actions.setIn({ field: 'ethSidechain', params }));

	return true;
};

import { Apis } from 'echojs-ws';
import { keccak256 } from 'js-sha3';

export const getMethodId = (str) => keccak256(str).substr(0, 8);

export const getBalance = async (accountId, contractId) => {

	const result = await Apis.instance().dbApi().exec(
		'call_contract_no_changing_state',
		[contractId, accountId, '1.3.0', getMethodId('balanceOf(address)')],
	);

	return result;
};

export const getToken = async (accountId, contractId) => {
	const result = await Apis.instance().dbApi().exec(
		'call_contract_no_changing_state',
		[contractId, accountId, '1.3.0', getMethodId('name')],
	);

	return result;
};

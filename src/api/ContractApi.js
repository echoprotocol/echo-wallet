import { Apis } from 'echojs-ws';
import { keccak256 } from 'js-sha3';

export const getBalance = async (accountId, contractId) => {
	const methodId = keccak256('balanceOf(address tokenOwner)').substr(0, 8);

	const result = await Apis.instance().dbApi().exec(
		'call_contract_no_changing_state',
		[contractId, accountId, '1.3.0', methodId],
	);

	return result;
};

export const getToken = async (accountId, contractId) => {
	const methodId = keccak256('name').substr(0, 8);

	const result = await Apis.instance().dbApi().exec(
		'call_contract_no_changing_state',
		[contractId, accountId, '1.3.0', methodId],
	);

	return result;
};

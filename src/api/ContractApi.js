import { Apis } from 'echojs-ws';
import { keccak256 } from 'js-sha3';

//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (contract, account, method) => Apis.instance().dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', method],
);

const getMethodId = (str) => keccak256(str).substr(0, 8);
//	end


export const getBalance = async (accountId, contractId) => {

	const result = await getContractProp(contractId, accountId, getMethodId('balanceOf(address)'));

	return result;
};

export const getToken = async (accountId, contractId) => {
	const result = await getContractProp(contractId, accountId, getMethodId('name'));

	return result;
};

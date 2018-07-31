import { Apis } from 'echojs-ws';
import { keccak256 } from 'js-sha3';

//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (contract, account, method) => Apis.instance().dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', method],
);

const getContractResult = (contract) => Apis.instance().dbApi().exec(
	'get_contract_result',
	[contract],
);

const getHash = (str) => keccak256(str);
//	end


export const getConstant = async (contractId, accountId) => {

	const result = await getContractProp(contractId, accountId, getHash('name').substr(0, 8));

	return result;
};

export const getContractConstant = async (contractId) => {

	const result = await getContractResult(contractId);

	return result;
};

export const getBalance = async (accountId, contractId) => {

	const result = await getContractProp(contractId, accountId, getHash('balanceOf(address)').substr(0, 8));

	return result;
};

export const getToken = async (accountId, contractId) => {
	const result = await getContractProp(contractId, accountId, getHash('name').substr(0, 8));

	return result;
};

import { keccak256 } from 'js-sha3';

//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (instance, contract, account, method) => instance.dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', method],
);

const getContractResult = (instance, contract) => instance.dbApi().exec(
	'get_contract_result',
	[contract],
);

const getContractInfo = (instance, contract) => instance.dbApi().exec('get_contract', [contract]);

export const getHash = (str) => keccak256(str);

//	end

export const getContractId = (address) => parseInt(address.substr(-32), 16);

export const getTokenBalance = (instance, accountId, contractId) => getContractProp(
	instance,
	contractId,
	accountId,
	getHash('balanceOf(address)').substr(0, 8),
);

export const getTokenSymbol = (instance, accountId, contractId) => getContractProp(
	instance,
	contractId,
	accountId,
	getHash('symbol').substr(0, 8),
);
export const getContractConstant = (instance, accountId, contractId, method) => getContractProp(
	instance,
	contractId,
	accountId,
	method,
);

export const getAddress = (instance, contractId) => getContractResult(
	instance,
	contractId,
);
export const getContract = (instance, contractId) => getContractInfo(instance, contractId);

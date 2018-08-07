import { keccak256 } from 'js-sha3';

import { getMethod, formatSignature } from '../helpers/AbiHelper';
import { toInt, toUtf8 } from '../helpers/ConverterHelper';


//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (instance, contract, account, code) => instance.dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', code],
);

export const getContractResult = (instance, resultId) => instance.dbApi().exec(
	'get_contract_result',
	[resultId],
);

const getContractInfo = (instance, contract) => instance.dbApi().exec('get_contract', [contract]);

export const getHash = (str) => keccak256(str);

//	end

export const getContractId = (address) => parseInt(address.substr(-32), 16);

export const getTokenBalance = async (instance, accountId, contractId) => {
	const method = { name: 'balanceOf', inputs: [{ type: 'address' }] };
	const args = [accountId];
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		getMethod(method, args),
	);

	return toInt(result);
};

export const getTokenSymbol = async (instance, accountId, contractId) => {
	const method = { name: 'symbol', inputs: [] };
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		formatSignature(method),
	);

	return toUtf8(result);
};

export const getTokenPrecision = async (instance, accountId, contractId) => {
	const method = { name: 'decimals', inputs: [] };
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		formatSignature(method),
	);

	return toInt(result);
};

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

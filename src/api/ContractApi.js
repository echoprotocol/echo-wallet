import {
	getMethodId,
	getMethod,
} from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';

//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (instance, contract, account, code) => instance.dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', code],
);

export const getResult = (instance, resultId) => instance.dbApi().exec(
	'get_contract_result',
	[resultId],
);

const getContractInfo = (instance, contract) => instance.dbApi().exec('get_contract', [contract]);
//	end

export const getContractResult = (instance, resultId) => getResult(instance, resultId);

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
		getMethodId(method),
	);

	return toUtf8(result.substr(-64));
};

export const getTokenPrecision = async (instance, accountId, contractId) => {
	const method = { name: 'decimals', inputs: [] };
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		getMethodId(method),
	);

	return toInt(result);
};

export const getContractConstant = (instance, contractId, accountId, method) => getContractProp(
	instance,
	contractId,
	accountId,
	method,
);

export const getContract = (instance, contractId) => getContractInfo(instance, contractId);

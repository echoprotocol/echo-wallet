import { keccak256 } from 'js-sha3';

import { getMethod } from '../helpers/ContractHelper';
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

export const getHash = (str) => keccak256(str);

export const formatSignature = (constant) => getHash(`${constant.name}(${constant.inputs.map((input) => input.type).join(',')})`).substr(0, 8);

const getContractInfo = (instance, contract) => instance.dbApi().exec('get_contract', [contract]);

const addressFromAccountId = (id) => {
	const prefix = id.split('.').splice(0, 2).join('.');

	if (prefix !== '1.2') {
		throw new Error('Unknown id type');
	}

	const hex = parseInt(id.split('.')[2], 10).toString(16);

	return Array(64 - String(hex).length).fill(0).join('').concat(String(hex));
};

//	end

export const getContractId = (address) => parseInt(address.substr(-32), 16);

export const getContractResult = (instance, resultId) => getResult(instance, resultId);

export const getTransferTokenCode = (to, amount) => {
	const toAddress = addressFromAccountId(to);
	amount = parseInt(amount, 10).toString(16);
	const amountHex = Array(64 - amount.length).fill(0).join('').concat(amount);
	const methodId = getHash('transfer(address,uint256)').substr(0, 8);

	return `${methodId}${toAddress}${amountHex}`;
};

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

	return toUtf8(result.substr(-64));
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

export const getContract = (instance, contractId) => getContractInfo(instance, contractId);

import { ChainValidation } from 'echojs-lib';
import { keccak256 } from 'js-sha3';

import operations from '../constants/Operations';
import { getLog, logParser } from './FormatHelper';

export const getHash = (str) => keccak256(str);

export const getMethodId = (method) => {
	const inputs = method.inputs.map((input) => input.type).join(',');

	return getHash(`${method.name}(${inputs})`).substr(0, 8);
};

export const getMethod = (method, args) => {
	if (!args || !args.length) {
		return 'Empty field';
	}

	const argsString = args.map((arg) => {
		let newArg = '';
		if (!Number.isNaN(Number(arg))) {
			newArg += Number(arg).toString(16);
		} else if (ChainValidation.is_object_id(arg)) {
			newArg = parseInt(arg.substr(arg.lastIndexOf('.') + 1), 10).toString(16);
		} else if ((typeof arg) === 'string') {
			for (let i = 0; i < arg.length; i += 1) {
				if (!Number.isNaN(arg.charAt(i))) {
					newArg += arg.charCodeAt(i).toString(16);
				} else {
					newArg += parseInt(arg.charAt(i), 10).toString(16);
				}
			}
		}
		return newArg.padStart(64, '0');
	});

	method = getMethodId(method);
	method = method.concat(argsString.join(''));
	return method;
};

export const checkBlockTransaction = (accountId, op, tokens) => {
	const operation = op[0];
	if (operation !== operations.contract.value) return false;

	const contractId = op[1].receiver;
	if (!contractId) return false;

	const token = tokens.find((t) => (t.contractId === contractId));

	if (!token) return false;
	const registar = op[1].registrar;

	return (registar && (registar === accountId));
};

export const checkTransactionResult = (accountId, result) => {
	const log = getLog(result);
	if (!log) return false;
	const accountIdNumber = Number(accountId.split('.')[2]);
	return logParser(log).some((e) => {
		if (e.event === 'transfer') {
			return e.params.map((p) => parseInt(p, 16)).includes(accountIdNumber);
		}
		return false;
	});
};

export const getContractId = (address) => parseInt(address.substr(-32), 16);

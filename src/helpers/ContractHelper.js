import { ChainValidation } from 'echojs-lib';
import { keccak256 } from 'js-sha3';

import operations from '../constants/Operations';
import { getLog, logParser } from './FormatHelper';

const zero64String = '0000000000000000000000000000000000000000000000000000000000000000';

export const getHash = (str) => keccak256(str);

export const getMethodId = (method) => {
	const inputs = method.inputs.map((input) => input.type).join(',');

	return getHash(`${method.name}(${inputs})`).substr(0, 8);
};

const to64HexString = (v) => {
	if (typeof v === 'number') {
		return Number(v).toString(16).padStart(64, '0');
	} else if ((ChainValidation.is_object_id(v))) {
		return Number(v.substr(v.lastIndexOf('.') + 1)).toString(16).padStart(64, '0');
	}
	/*
	['0xff', '0xff']
0xe7984f8b
0000000000000000000000000000000000000000000000000000000000000020
0000000000000000000000000000000000000000000000000000000000000002
aa00000000000000000000000000000000000000000000000000000000000000
aa00000000000000000000000000000000000000000000000000000000000000
['0xff']
0xe7984f8b
0000000000000000000000000000000000000000000000000000000000000020
0000000000000000000000000000000000000000000000000000000000000001
ff00000000000000000000000000000000000000000000000000000000000000

	 */
	try {
		const arr = JSON.parse(v);
		if (Array.isArray(arr)) {
			return arr.reduce(() => (), '');
		}
		return Buffer.from(v).toString('hex').padEnd(64, '0');
	} catch (e) {
		return Buffer.from(v).toString('hex').padEnd(64, '0');
	}

};

const encodeString = (value) => {
	value = String(value);
	const arg = to64HexString(value.length);

	const chunks = value.match(new RegExp(`.{1,${32}}`, 'g'));

	if (!chunks) return arg.concat(zero64String);

	return chunks.reduce((newArg, chunk) => (newArg.concat(to64HexString(chunk))), arg);

};

export const getMethod = (method, args) => {
	if (!args || !args.length) {
		return 'Empty field';
	}
	let chunkCount = 0;
	let hexStrings = '';
	const argsString = method.inputs.reduce((hexArgs, v, i) => {
		const arg = args[i];
		if (!arg) return hexArgs;
		const { type } = v;
		chunkCount += 1;
		if (type.search('[]') !== -1) {
            return hexArgs.concat(to64HexString(arg));
		} else if (type.search('int') !== -1) {
			return hexArgs.concat(to64HexString(Number(arg)));
		} else if (type.search('address') !== -1) {
			return hexArgs.concat(to64HexString(arg));
		} else if (type.search('bool') !== -1) {
			const tmpValue = arg.toLowerCase() === 'false' ? 0 : Boolean(arg);
			return hexArgs.concat(to64HexString(Number(tmpValue)));
		} else if (type.search('byte') !== -1) {

		} else if (type.search('string')) {
			hexStrings = hexStrings.concat(encodeString(arg));
			return hexArgs.concat(to64HexString(32 * chunkCount));
		}
		return hexArgs;
	}, '');

	method = getMethodId(method);
	return method.concat(argsString);
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

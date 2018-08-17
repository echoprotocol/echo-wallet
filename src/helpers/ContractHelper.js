import { keccak256 } from 'js-sha3';

import operations from '../constants/Operations';
import { getLog, logParser } from './FormatHelper';

const zero64String = '0000000000000000000000000000000000000000000000000000000000000000';

export const getHash = (str) => keccak256(str);

export const getMethodId = (method) => {
	const inputs = method.inputs.map((input) => input.type).join(',');

	return getHash(`${method.name}(${inputs})`).substr(0, 8);
};

// string from, int256[] _to, bytes2[] to_from, int256 from_to, address[] adr

/*
0xd716f11e
offset string
00000000000000000000000000000000000000000000000000000000000000a0
offset int256[]
00000000000000000000000000000000000000000000000000000000000000e0
offset bytes2[]
0000000000000000000000000000000000000000000000000000000000000160
int256 value
000000000000000000000000000000000000000000000000000000000006c7fb
offset address[]
00000000000000000000000000000000000000000000000000000000000001c0
string size
0000000000000000000000000000000000000000000000000000000000000004
string data
6865726500000000000000000000000000000000000000000000000000000000
int256[] size
0000000000000000000000000000000000000000000000000000000000000003
int256[] data
0000000000000000000000000000000000000000000000000000000000000001
0000000000000000000000000000000000000000000000000000000000087a23
00000000000000000000000000000000000000000000000000000000000008ac
bytes2[] size
0000000000000000000000000000000000000000000000000000000000000002
bytes2[] data
ff00000000000000000000000000000000000000000000000000000000000000
aaaaaaaaaa000000000000000000000000000000000000000000000000000000
address[] size
0000000000000000000000000000000000000000000000000000000000000002
address[] data
000000000000000000000000f4d6004f69d99c6173376eee903d266d98a4c822
000000000000000000000000f4d6004f69d99c6173376eee903d266d98a4c822
 */

const to64HexString = (v, type) => {

	switch (type) {
		case 'int': {
			return Number(v).toString(16).padStart(64, '0');
		}
		case 'bool': {
			const tmpValue = v.toLowerCase() === 'false' ? 0 : Boolean(v);
			return Number(tmpValue).toString(16).padStart(64, '0');
		}
		case 'string': {
			return Buffer.from(v).toString('hex').padEnd(64, '0');
		}
		case 'hex': {
			return v.replace('0x', '').padEnd(64, '0');
		}
		case 'address': {
			return Number(v.substr(v.lastIndexOf('.') + 1)).toString(16).padStart(64, '0');
		}
		default:
			return zero64String;
	}
};

const encode = (value, type, isArray) => {
	let arg = '';
	if (isArray) {
		try {
			value = JSON.parse(value);
			if (!Array.isArray(value)) return zero64String;
		} catch (e) {
			return zero64String;
		}
		if (value.length === 0) return zero64String;
		arg = to64HexString(value.length, 'int');
		return value.reduce((newArg, v) => (newArg.concat(to64HexString(v, type))), arg);
	}

	if (type === 'string' || type === 'hex') {

		if (value.length === 0) return zero64String;
		const mode = type === 'hex' ? 2 : 1;

		arg = to64HexString(value.length / mode, 'int');

		const chunks = value.match(new RegExp(`.{1,${32 * mode}}`, 'g'));
		const chunksLength = chunks.length;
		return type === 'hex' ?
			arg.concat(value.padEnd(chunksLength * 64), '0') :
			chunks.reduce((newArg, v) => (newArg.concat(to64HexString(v, type))), arg);
	}
	return to64HexString(value, type);

};

export const getMethod = (method, args) => {
	if (!args || !args.length) {
		return 'Empty field';
	}

	let hexStrings = '';
	const defaultOffset = (method.inputs.length * 32);
	const argsString = method.inputs.reduce((hexArgs, v, i) => {

		const arg = args[i];
		if (!arg) return hexArgs;
		const { type } = v;

		let isArray = false;

		const offset = defaultOffset + (hexStrings.length ? hexStrings.length / 2 : 0);

		if (type.search('\\[\\]') !== -1) {
			isArray = true;
		}

		if (type.search('int') !== -1) {

			const result = encode(arg, 'int', isArray);
			if (isArray) hexStrings = hexStrings.concat(result);
			else hexArgs = hexArgs.concat(result);

		} else if (type.search('address') !== -1) {

			const result = encode(arg, 'address', isArray);
			if (isArray) hexStrings = hexStrings.concat(result);
			else hexArgs = hexArgs.concat(result);

		} else if (type.search('bool') !== -1) {

			const result = encode(arg, 'bool', isArray);
			if (isArray) hexStrings = hexStrings.concat(result);
			else hexArgs = hexArgs.concat(result);

		} else if (type.search('byte') !== -1) {


			if (type !== 'bytes') isArray = true;
			hexStrings = hexStrings.concat(encode(arg, 'hex', isArray));
			isArray = true;

		} else if (type.search('string') !== -1) {

			hexStrings = hexStrings.concat(encode(arg, 'string', isArray));
			isArray = true;

		}

		if (isArray) hexArgs = hexArgs.concat(to64HexString(offset, 'int'));
		return hexArgs;
	}, '');

	method = getMethodId(method);
	return method.concat(argsString, hexStrings);
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

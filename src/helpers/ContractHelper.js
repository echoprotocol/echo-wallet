import { keccak256 } from 'js-sha3';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';

const zero64String = '0000000000000000000000000000000000000000000000000000000000000000';

export const getHash = (str) => keccak256(str);

/**
 * @method getMethodId
 * @param {Object} method
 * @returns {String}
 */
export const getMethodId = (method) => {
	const inputs = method.inputs.map((input) => input.type).join(',');

	return getHash(`${method.name}(${inputs})`).substr(0, 8);
};

/**
 * @method to64HexString
 * @param {String} v
 * @param {String} type
 * @param {Number} mode
 * @returns {String}
 */
const to64HexString = (v, type, mode = 256) => {

	switch (type) {
		case 'int': {
			return new BN(v).toTwos(mode).toString(16).padStart(64, '0');
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
			const sourceAddress = v || '1.2.0';
			if (!/^1\.(2|9)\.[1-9]\d*$/.test(sourceAddress)) throw new Error('invalid address format');
			const preRes = new BigNumber(sourceAddress.split('.')[2]).toString(16);
			if (preRes.length > 38) throw new Error('invalid address id');
			const isContract = sourceAddress.split('.')[1] === '9';
			return [
				new Array(25).fill(null).map(() => 0).join(''),
				isContract ? '1' : '0',
				new Array(38 - preRes.length).fill(null).map(() => 0).join(''),
				preRes,
			].join('');
		}
		default:
			return zero64String;
	}
};

/**
 * @method encode
 *
 * @param {any} value
 * @param {String} type
 * @param {Boolean} isArray
 * @param {Number} modeNumber
 * @returns {String}
 */
const encode = (value, type, isArray, modeNumber) => {
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

	return to64HexString(value, type, modeNumber);

};

/**
 * @method getMethod
 *
 * @param {Object} method
 * @param {Array} args
 * @returns {String}
 */
export const getMethod = (method, args) => {

	const code = getMethodId(method);

	if (!args || !args.length) { return code; }

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

		if (type.search('uint') !== -1) {
			const input = new BigNumber(arg);
			if (input.isNegative()) throw new Error('input is negative');
			if (!input.isInteger()) throw new Error('input is less than min value');
			if (input.gte(new BigNumber(2).pow(256))) throw new Error('is greater than max value');
			const preRes = input.toString(16);
			const comprehension = (count, map) => new Array(count).fill(null)
				.map((_, index) => map(index));
			const result = comprehension(64 - preRes.length, () => 0).join('') + preRes;

			if (isArray) hexStrings = hexStrings.concat(result);
			else hexArgs = hexArgs.concat(result);

		} else if (type.search('int') !== -1) {
			let mode = type.split('int')[1];
			mode = mode === '' ? 256 : parseInt(mode, 10);
			const result = encode(arg, 'int', isArray, mode);
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
		} else if (type.search('bytes32') !== -1) {
			const comprehension = (count, map) => new Array(count).fill(null)
				.map((_, index) => map(index));
			const bytesCount = 32;
			if (bytesCount <= 0) throw new Error('bytes count is not positive');
			if (!Number.isSafeInteger(bytesCount)) throw new Error('bytes count is not a integer');
			let input = arg;
			if (!input) return comprehension(bytesCount, () => 0).join('');
			if (typeof input === 'string') {
				if (/^0x([a-f\d]{2}){1,32}$/.test(input)) input = Buffer.from(input.substr(2), 'hex');
				else input = Buffer.from(input);
			}
			if (input.length !== bytesCount) {
				if (input.length > bytesCount) throw new Error('buffer is too large');
				const arr = Array.from(input);
				const align = 'left';
				if (align === 'none') throw new Error('buffer is too short');
				if (align === 'left') input = Buffer.from([...arr, ...comprehension(bytesCount - arr.length, () => 0)]);
				else input = Buffer.from([...comprehension(bytesCount - arr.length, () => 0), ...arr]);
			}
			hexArgs = hexArgs.concat(input.toString('hex'));
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

	return code.concat(argsString, hexStrings);
};

/**
 * @method getTransferCode
 * @param {String} id
 * @param {String} text
 * @returns {String}
 */
export const getTransferCode = (id, text) => {
	const method = keccak256('transfer(address,uint256)').substr(0, 8);

	const idArg = Number(id.split('.')[2]).toString(16).padStart(64, '0');

	const amountArg = text.toString(16).padStart(64, '0');

	return method + idArg + amountArg;
};
/**
 * @method getContractId
 * @param {String} address
 * @returns {Number}
 */
export const getContractId = (address) => parseInt(address.substr(-32), 16);

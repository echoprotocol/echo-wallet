import { validators, PublicKey } from 'echojs-lib';
import BN from 'bignumber.js';

import {
	ADDRESS_PREFIX,
	ERC20_HASHES,
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
	PUBLIC_KEY_LENGTH,
	PUBLIC_KEY_LENGTH_43,
} from '../constants/GlobalConstants';

const reg = /^[0-9a-fA-F]+$/;

export const contractIdRegex = /^[0-9.]*$/;
export const accountIdRegex = /^1\.2\.(0|[1-9]\d*)$/;
const committeeMemberIdRegex = /^1\.5\.(0|[1-9]\d*)$/;

/**
 * @method isAccountNameError
 * @param {String} value
 * @param {(null | Boolean)} allowShort
 * @returns {String}
 */
const isAccountNameError = (value, allowShort) => {
	if (allowShort == null) {
		allowShort = false;
	}
	let suffix = 'Account name should';
	if (!value) {
		return `${suffix} not be empty.`;
	}

	if (value.length > 63) {
		return `${suffix} be shorter then 63 symbols.`;
	}

	if (!(/[.\-/0-9]/.test(value) || !value.match(/[aeiouy]/ig))) {
		return `${suffix} be cheap (contain digit, number, dash, slash or consist only of consonants)`;
	}
	if (/\./.test(value)) {
		suffix = 'Each account segment should';
	}

	const ref = value.split('.');

	for (let i = 0; i < ref.length; i += 1) {
		const label = ref[i];
		if (!/^[~a-z]/.test(label)) {
			return `${suffix} start with a latin letter.`;
		}
		if (!/^[~a-z0-9-]*$/.test(label)) {
			return `${suffix} have only latin letters, digits, or dashes.`;
		}
		if (/--/.test(label)) {
			return `${suffix} have only one dash in a row.`;
		}
		if (!/[a-z0-9]$/.test(label)) {
			return `${suffix} end with a latin letter or digit.`;
		}
	}
	return null;
};

/**
 * @method validateAccountName
 * @param {String} accountName
 * @returns {(String | null)}
 */
export const validateAccountName = (accountName) => {
	if (!accountName) { return 'Account name should not be empty'; }

	if (isAccountNameError(accountName)) {
		return isAccountNameError(accountName);
	}

	return null;
};

/**
 * @method validateWIF
 * @param {String} wif
 * @returns {(String | null)}
 */
export const validateWIF = (wif) => {
	if (!wif) { return 'WIF should not be empty'; }

	return null;
};

/**
 * @method validateCode
 * @param {String} code
 * @returns {(String | null)}
 */
export const validateCode = (code) => {
	if (!code) {
		return 'field should be not empty';
	}

	if (!reg.test(code)) {
		return 'field should be hex string';
	}

	if (code.length % 2 !== 0) {
		return 'code should include an even count of symbol';
	}

	return null;
};

/**
 * @method validateContractName
 * @param {String} name
 * @returns {(String | null)}
 */
export const validateContractName = (name) => {
	if (!name) {
		return 'Contract name should not be empty';
	}

	if (name.length < 2) {
		return 'Contract name must be 2 characters or more';
	}

	if (name.length > 16) {
		return 'Contract name must be 16 characters or less';
	}

	if (!name.match(/^[a-zA-Z0-9._ ]+$/)) {
		return 'Invalid symbols';
	}

	return null;
};

/**
 * @method validateAbi
 * @param {String} str
 * @returns {(String | null)}
 */
export const validateAbi = (str) => {
	if (!str) {
		return 'Contract ABI should not be empty';
	}

	const schema = {
		function: {
			constant: 'boolean',
			inputs: 'array',
			name: 'string',
			outputs: 'array',
			payable: 'boolean',
			type: 'string',
		},
		constructor: {
			inputs: 'array',
			payable: 'boolean',
			stateMutability: 'string',
			type: 'string',
		},
		fallback: {
			payable: 'boolean',
			type: 'string',
		},
		event: {
			anonymous: 'boolean',
			inputs: 'array',
			name: 'string',
			type: 'string',
		},
	};

	try {
		const json = JSON.parse(str);

		if (!Array.isArray(json) || !json.length) {
			throw new Error('Invalid ABI');
		}

		json.forEach((item) => {
			if (typeof item !== 'object') {
				throw new Error('Invalid ABI');
			}

			if (!item.type || typeof item.type !== 'string' || !schema[item.type]) {
				throw new Error('Invalid ABI');
			}

			const typeSchema = schema[item.type];

			if (item.stateMutability) {
				typeSchema.stateMutability = 'string';
			}

			Object.entries(item).forEach(([name, value]) => {
				let valueType = typeof value;

				if (valueType === 'object') {
					valueType = Array.isArray(value) ? 'array' : valueType;
				}

				if (!typeSchema[name] || valueType !== typeSchema[name]) {
					throw new Error('Invalid ABI');
				}

			});
		});

		return null;
	} catch (e) {
		return 'Invalid ABI';
	}
};

/**
 * @method validateInt
 * @param {Number} value
 * @param {Boolean} isUint
 * @param {Number} size
 * @returns {(String | null)}
 */
const validateInt = (value, isUint, size = 256) => {
	value = Number(value);
	if (!Number.isInteger(value)) return 'value should be integer';

	if (isUint && value < 0) return 'value should be unsigned integer';

	if (size % 8 !== 0) return 'various sizes should be in in steps of 8';

	const maxLimit = isUint ? (2 ** size) - 1 : ((2 ** (size - 1)) - 1);
	const minLimit = isUint ? 0 : -(2 ** (size - 1));

	if (value > maxLimit && value < minLimit) return `value should be in ${isUint ? 'u' : ''}int${size} format`;

	return null;
};

/**
 * @method validateString
 * @param {String} value
 * @returns {(String | null)}
 */
const validateString = (value) => (typeof value === 'string' ? null : 'value should be a string');
/**
 * @method validateAddress
 * @param {any} value
 * @returns {(String | null)}
 */
const validateAddress = (value) => (validators.isObjectId(value) ? null : 'value should be in object id format');
/**
 * @method validateBool
 * @param {Boolean} value
 * @returns {(String | null)}
 */
const validateBool = (value) => (typeof value === 'boolean' ? null : 'value should be a boolean');
/**
 * @method validateArray
 * @param {Array} value
 * @returns {(String | null)}
 */
const validateArray = (value) => (Array.isArray(value) ? null : 'value should be an array');
/**
 * @method validateBytes
 * @param {String} value
 * @returns {(String | null)}
 */
const validateBytes = (value) => ((typeof value === 'string' && reg.test(value)) ? null : 'value should be a hex string');

/**
 * @method validateByType
 * @param {String} value
 * @param {String} type
 * @returns {String}
 */
export const validateByType = (value, type) => {
	if (!value) return 'Value should not be empty';

	let method = null;
	let isUint = null;
	let size = null;
	let isBytesArray = false;

	const intMark = type.search('int');
	if (type.search('string') !== -1 || type.search('bytes32') !== -1) {
		method = validateString;
	} else if (type.search('address') !== -1) {
		method = validateAddress;
	} else if (type.search('bool') !== -1) {
		method = validateBool;
	} else if (type.search('byte') !== -1) {
		isBytesArray = type !== 'bytes';
		method = validateBytes;
	} else if (intMark !== -1) {
		method = validateInt;
		isUint = (intMark === 1);
		const match = type.match(/\d+/);
		size = match && match[0];
	} else {
		return 'value could not be validated';
	}

	const arrayMark = type.search('\\[\\]');

	if (type.search('bool') !== -1) {
		try {
			value = JSON.parse(value);
		} catch (e) {
			return `value should be a ${type}`;
		}
	}

	if (arrayMark !== -1 || isBytesArray) {
		try {
			value = JSON.parse(value);
		} catch (e) {
			return `value should be an ${type} array`;
		}
		let error = validateArray(value);
		if (error) return error;
		value.some((v) => {
			error = method(v, isUint, size);
			return error;
		});

		return error ? `in array ${error}` : error;
	}

	return method(value, isUint, size);

};

/**
 * @method validateAmount
 * @param {any} value
 * @param {Object} param1
 * @returns {(null | String)}
 */
export const validateAmount = (value, { symbol, precision, balance }) => {
	let amount = new BN(value);

	if (amount.eq(0)) {
		return null;
	}

	if (!Math.floor(value * (10 ** precision))) {
		return `Amount should be more than 0 (${symbol} precision is ${precision} symbols)`;
	}

	amount = amount.times(10 ** precision);

	if (!amount.isInteger()) {
		return `${symbol} precision is ${precision} symbols`;
	}

	if (new BN(value).times(10 ** precision).gt(balance)) {
		return 'Insufficient funds';
	}

	if (amount.isNegative()) {
		return 'Amount should be positive number';
	}

	return null;
};

/**
 * @method validateFee
 * @param {Object} amount
 * @param {Object} currency
 * @param {Object} fee
 * @param {Array} assets
 * @returns {(null | String)}
 */
export const validateFee = (amount, currency, fee, assets) => {
	if (currency && currency.id === fee.asset.id) {
		const total = new BN(amount.value).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			return 'Insufficient funds';
		}
	} else {
		const asset = assets.find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			return 'Insufficient funds';
		}
	}

	return null;
};

/**
 * @method validateNetworkName
 * @param {String} name
 * @returns {(null | String)}
 */
export const validateNetworkName = (name) => {
	if (!name) {
		return 'Network name should not be empty';
	}

	if (name.length < 2) {
		return 'Network name must be 2 characters or more';
	}

	if (name.length > 32) {
		return 'Network name must be 32 characters or less';
	}

	if (!name.match(/^[a-zA-Z0-9._ ]+$/)) {
		return 'Network name should have only latin letters, numbers, dots, underscores and spaces';
	}

	return null;
};

/**
 * @method validateNetworkAddress
 * @param {String} address
 * @returns {(null | String)}
 */
export const validateNetworkAddress = (address) => {
	if (!address) {
		return 'Network address should not be empty';
	}

	if (!(/ws:\/\/|wss:\/\//i).test(address)) {
		return 'Network address should be start with \'ws://\' or \'wss://\'';
	}

	return null;
};

/**
 * @method isAccountId
 * @param {String} v
 * @returns {Boolean}
 */
export const isAccountId = (v) => accountIdRegex.test(v);

/**
 * @method isAccountId
 * @param {String} v
 * @param {String} addressPrefix
 * @returns {(Boolean | String)}
 */
export const isPublicKey = (v, addressPrefix = ADDRESS_PREFIX) => {
	if (typeof v !== 'string' ||
		(v.length !== (PUBLIC_KEY_LENGTH + addressPrefix.length) &&
		v.length !== (PUBLIC_KEY_LENGTH_43 + addressPrefix.length))) return false;

	const prefix = v.slice(0, addressPrefix.length);

	try {
		PublicKey.fromStringOrThrow(v, addressPrefix);
	} catch (e) {
		return false;
	}

	return addressPrefix === prefix;
};

/**
 * @method isWeight
 * @param {Number} v
 * @returns {Boolean}
 */
export const isWeight = (v) => {
	if (typeof v === 'number' && (v > Number.MAX_SAFE_INTEGER || v < Number.MIN_SAFE_INTEGER)) return false;

	const bn = new BN(v);

	return bn.isInteger();
};

/**
 * @method isThreshold
 * @param {Number} v
 * @returns {Boolean}
 */
export const isThreshold = (v) => {
	const thresholdNumber = Number(v);
	return !(v === '' || !Number.isInteger(thresholdNumber) || thresholdNumber <= 0);
};

/**
 * @method isCommitteeMemberId
 * @param {String} v
 * @returns {Boolean}
 */
export const isCommitteeMemberId = (v) => (typeof v === 'string') && committeeMemberIdRegex.test(v);

/**
 * @method validatePassword
 * @param {String} v
 * @returns {(Boolean | String)}
 */
export const validatePassword = (v) => {
	if (!v) {
		return 'Password should not be empty';
	}

	const regPasswordLength = new RegExp(`^[\\w+]{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`);

	if (!v.match(regPasswordLength)) {
		return `Password should have only latin letters from ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters`;
	}

	if (!/[A-Z]+/.test(v)) {
		return 'Password should have one latin uppercase letter';
	}

	if (!/[a-z]+/.test(v)) {
		return 'Password should have one latin lowercase letter';
	}

	if (!/^(?=.*[0-9])/.test(v)) {
		return 'Password should have one number';
	}

	return null;
};

/**
 * @method checkErc20Contract
 * @param {String} scriptHex
 * @returns {boolean}
 */
export const checkErc20Contract = (scriptHex) => {
	if (scriptHex) {
		const hashes = Object.values(ERC20_HASHES);
		return hashes.every((hash) => scriptHex.includes(hash.toString()));
	}

	return false;
};

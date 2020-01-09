import { validators, PublicKey, OPERATIONS_IDS } from 'echojs-lib';
import BN from 'bignumber.js';

import {
	ADDRESS_PREFIX,
	ERC20_HASHES,
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
	PUBLIC_KEY_LENGTH,
	PUBLIC_KEY_LENGTH_43,
} from '../constants/GlobalConstants';
import { SIDECHAIN_ASSETS_DATA } from '../constants/SidechainConstants';

const reg = /^(([\da-fA-F]){2})*$/;

const protocolRegExpString = '((https|http|wss|ws):\\/\\/)?';
const domainRegExpString = '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}'; // domain name
const ipRegExpString = '(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|' + // OR ip (v4) address
'\\[(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\]'; // OR ip (v6) address

const pathRegExpString = '(:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?' + // port
'(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
'(\\#[-a-z\\d_]*)?$'; // fragment locater

const validateUrlMode = 'i';

const ipRegExp = new RegExp(`^${protocolRegExpString}${ipRegExpString}${pathRegExpString}`, validateUrlMode);
const domainRegExp = new RegExp(`^${protocolRegExpString}${domainRegExpString}${pathRegExpString}`, validateUrlMode);
const urlRegex = new RegExp(`^(${protocolRegExpString}(${domainRegExpString}|${ipRegExpString}))${pathRegExpString}`, validateUrlMode);

export const contractIdRegex = /^[0-9.]*$/;
export const accountIdRegex = /^1\.2\.(0|[1-9]\d*)$/;
const committeeMemberIdRegex = /^1\.5\.(0|[1-9]\d*)$/;
const accountAddressRegex = /^[a-fA-F0-9]{40}$/;

/**
 * @method isAccountNameError
 * @param {String} value
 * @param {Boolean)} allowShort
 * @param {Boolean)} allowExpensive
 * @returns {String}
 */
const isAccountNameError = (value, allowExpensive = false) => {
	if (!value) {
		return 'errors.account_errors.empty_account_error';
	}

	if (value.length > 63) {
		return 'errors.account_errors.account_name_too_big_error';
	}

	if (!allowExpensive && (!(/[.\-0-9]/.test(value) || !value.match(/[aeiouy]/ig)))) {
		return 'errors.account_errors.account_not_contain_req_symbols';
	}
	const ref = value.split('.');

	for (let i = 0; i < ref.length; i += 1) {
		const label = ref[i];
		if (!/^[~a-z]/.test(label)) {
			return 'errors.account_errors.account_segment_beginning_error';
		}
		if (!/^[~a-z0-9-]*$/.test(label)) {
			return 'errors.account_errors.account_segment_contains_error';
		}
		if (/--/.test(label)) {
			return 'errors.account_errors.account_segment_dash_error';
		}
		if (!/[a-z0-9]$/.test(label)) {
			return 'errors.account_errors.account_segment_ending_error';
		}
	}
	return null;
};

/**
 * @method validateAccountName
 * @param {string} accountName
 * @param {boolean} allowExpensive
 * @returns {(String | null)}
 */
export const validateAccountName = (accountName, allowExpensive) => {
	if (!accountName) { return 'errors.account_errors.empty_account_error'; }

	const accountNameError = isAccountNameError(accountName, allowExpensive);

	return accountNameError || null;
};

/**
 * @method validateWIF
 * @param {String} wif
 * @returns {(String | null)}
 */
export const validateWIF = (wif) => {
	if (!wif) { return 'errors.keys_errors.empty_wif_error'; }

	return null;
};

/**
 * @method validateCode
 * @param {String} code
 * @param {Boolean} canBeEmpty
 * @returns {(String | null)}
 */
export const validateCode = (code, canBeEmpty = false) => {
	if (!code && !canBeEmpty) {
		return 'errors.contract_code_errors.empty_field_error';
	}

	if (!reg.test(code)) {
		return 'errors.contract_code_errors.empty_field_error';
	}

	if (code.length % 2 !== 0) {
		return 'errors.contract_code_errors.code_symbols_count_error';
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
		return 'errors.contract_errors.empty_name_error';
	}

	if (name.length < 2) {
		return 'errors.contract_errors.name_to_short_error';
	}

	if (name.length > 16) {
		return 'errors.contract_errors.name_to_large_error';
	}

	if (!name.match(/^[a-zA-Z0-9._ ]+$/)) {
		return 'errors.contract_errors.invalid_symbols_error';
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
		return 'errors.contract_errors.empty_abi_error';
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
			throw new Error('errors.contract_errors.invalid_abi_error');
		}

		json.forEach((item) => {
			if (typeof item !== 'object') {
				throw new Error('errors.contract_errors.invalid_abi_error');
			}

			if (!item.type || typeof item.type !== 'string' || !schema[item.type]) {
				throw new Error('errors.contract_errors.invalid_abi_error');
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
					throw new Error('errors.contract_errors.invalid_abi_error');
				}

			});
		});

		return null;
	} catch (e) {
		return 'errors.contract_errors.invalid_abi_error';
	}
};

/**
 * @method validateBytes
 * @param {String} value
 * @returns {boolean}
 */
export const validateAccountAddress = (value) => typeof value === 'string' && accountAddressRegex.test(value);

/**
 * @method validateInt
 * @param {Number} value
 * @param {Boolean} isUint
 * @param {Number} size
 * @returns {(String | null)}
 */
const validateInt = (value, isUint, size = 256) => {
	value = Number(value);
	if (!Number.isInteger(value)) return 'errors.validate_value_errors.should_be_int';

	if (isUint && value < 0) return 'errors.validate_value_errors.should_be_uint';

	if (size % 8 !== 0) return 'errors.validate_value_errors.should_be_in_8_steps';

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
const validateString = (value) => (typeof value === 'string' ? null : 'errors.validate_value_errors.should_be_string');
/**
 * @method validateAddress
 * @param {any} value
 * @returns {(String | null)}
 */
const validateAddress = (value) => (validators.isObjectId(value) ? null : 'errors.validate_value_errors.should_be_object_id');
/**
 * @method validateBool
 * @param {Boolean} value
 * @returns {(String | null)}
 */
const validateBool = (value) => (typeof value === 'boolean' ? null : 'errors.validate_value_errors.should_be_boolean');
/**
 * @method validateArray
 * @param {Array} value
 * @returns {(String | null)}
 */
const validateArray = (value) => (Array.isArray(value) ? null : 'errors.validate_value_errors.should_be_array');
/**
 * @method validateBytes
 * @param {String} value
 * @returns {(String | null)}
 */
const validateBytes = (value) => ((typeof value === 'string' && reg.test(value)) ? null : 'errors.validate_value_errors.should_be_hex');

/**
 * @method validateByType
 * @param {String} value
 * @param {String} type
 * @returns {String}
 */
export const validateByType = (value, type) => {
	if (!value) return 'errors.validate_value_errors.empty_value_error';

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
		return 'errors.validate_value_errors.cant_validate_error';
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
		return 'errors.amount_errors.zero_amount_error';
	}

	if (!Math.floor(value * (10 ** precision))) {
		return 'errors.amount_errors.zero_amount_error';
	}

	amount = amount.times(10 ** precision);

	if (!amount.isInteger()) {
		return `${symbol} precision is ${precision} symbols`;
	}

	if (new BN(value).times(10 ** precision).gt(balance)) {
		return 'errors.amount_errors.insufficient_funds';
	}

	if (amount.isNegative()) {
		return 'errors.amount_errors.negative_amount_error';
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
			return 'errors.fee_errors.negative_amount_error';
		}
	} else {
		const asset = assets.find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			return 'errors.fee_errors.negative_amount_error';
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
		return 'errors.network_errors.empty_network_name';
	}

	if (name.length < 2) {
		return 'errors.network_errors.name_too_short_error';
	}

	if (name.length > 32) {
		return 'errors.network_errors.name_too_large_error';
	}

	if (!name.match(/^[a-zA-Z0-9._ ]+$/)) {
		return 'errors.network_errors.network_incorrect_symbols_error';
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
		return 'errors.network_errors.empty_network_name';
	}

	if (!(/ws:\/\/|wss:\/\//i).test(address)) {
		return 'errors.network_errors.network_req_symbols_error';
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
		return 'errors.passowd_errors.empty_password_error';
	}

	const regPasswordLength = new RegExp(`^[\\w+]{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`);

	if (!v.match(regPasswordLength)) {
		return 'errors.passowd_errors.password_length_error';
	}

	if (!/[A-Z]+/.test(v)) {
		return 'errors.passowd_errors.no_uppercase_error';
	}

	if (!/[a-z]+/.test(v)) {
		return 'errors.passowd_errors.no_lowercase_error';
	}

	if (!/^(?=.*[0-9])/.test(v)) {
		return 'errors.passowd_errors.no_number_error';
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

/**
 *
 * @param version
 * @param minAccessVersion
 * @returns {boolean}
 */
export const checkAccessVersion = (version, minAccessVersion) => {
	const [major, minor, patch] = [...version.split('.')].map((part) => parseInt(part, 10));
	const [minMajor, minMinor, minPatch] = [...minAccessVersion.split('.')].map((part) => parseInt(part, 10));
	return !(minMajor > major || minMinor > minor || minPatch > patch);
};

export const getSidechainTrxAsset = (id) => {
	switch (id) {
		case OPERATIONS_IDS.SIDECHAIN_ETH_DEPOSIT:
		case OPERATIONS_IDS.SIDECHAIN_ETH_WITHDRAW:
		case OPERATIONS_IDS.SIDECHAIN_ISSUE:
		case OPERATIONS_IDS.SIDECHAIN_BURN:
			return SIDECHAIN_ASSETS_DATA.eETH;
		case OPERATIONS_IDS.SIDECHAIN_BTC_WITHDRAW:
			return SIDECHAIN_ASSETS_DATA.eBTC;
		default: return null;
	}
};

export const isUrlOrAddress = (v) => urlRegex.test(String(v));
export const isIpAddress = (v) => ipRegExp.test(String(v));
export const isDomainAddress = (v) => domainRegExp.test(String(v));

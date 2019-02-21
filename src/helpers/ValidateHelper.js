import { ChainValidation } from 'echojs-lib';
import BN from 'bignumber.js';

const reg = /^[0-9a-fA-F]+$/;

export const contractIdRegex = /^[0-9.]*$/;

export const validateAccountName = (accountName) => {
	if (!accountName) { return 'Account name should not be empty'; }

	if (ChainValidation.is_account_name_error(accountName)) {
		return ChainValidation.is_account_name_error(accountName);
	}

	if (!ChainValidation.is_cheap_name(accountName)) {
		return 'Enter a name containing least one dash, a number or no vowels';
	}

	return null;
};

export const validatePassword = (password) => {
	if (!password) { return 'Password should not be empty'; }

	if (password.length !== 0 && password.length < 8) {
		return 'Password must be 8 characters or more';
	}

	return null;
};

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

export const validateContractId = (id) => {
	id = id.split('.');
	if (id.length !== 3 || id.splice(0, 2).join('.') !== '1.16' || Number.isInteger(id[2])) {
		return 'Invalid contract ID';
	}
	return null;
};

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

const validateString = (value) => (typeof value === 'string' ? null : 'value should be a string');
const validateAddress = (value) => (ChainValidation.is_object_id(value) ? null : 'value should be in object id format');
const validateBool = (value) => (typeof value === 'boolean' ? null : 'value should be a boolean');
const validateArray = (value) => (Array.isArray(value) ? null : 'value should be an array');
const validateBytes = (value) => ((typeof value === 'string' && reg.test(value)) ? null : 'value should be a hex string');


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

	return null;
};

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

export const validateNetworkAddress = (address) => {
	if (!address) {
		return 'Network address should not be empty';
	}

	if (!(/ws:\/\/|wss:\/\//i).test(address)) {
		return 'Network address should be start with \'ws://\' or \'wss://\'';
	}

	return null;
};

export const validateNetworkRegistrator = (registrator) => {
	if (!registrator) {
		return 'Network registrator should not be empty';
	}

	if (!(/http:\/\/|https:\/\//i).test(registrator)) {
		return 'Network registrator should be start with \'http://\' or \'https://\'';
	}

	return null;
};

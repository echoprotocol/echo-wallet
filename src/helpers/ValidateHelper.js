import { ChainValidation } from 'echojs-lib';

const reg = /^[0-9a-fA-F]+$/;

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

	return null;
};

export const validateAbi = (str) => {
	if (!str) {
		return 'Contract abi should not be empty';
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

			if (item.type === 'function' && !item.constant) {
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

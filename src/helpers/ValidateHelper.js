import { ChainValidation } from 'echojs-lib';

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

export const validateABI = (str) => {
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

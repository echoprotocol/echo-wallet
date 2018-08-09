import { ChainValidation } from 'echojs-lib';

const reg = /^[0-9a-fA-F]+$/;

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

export const validateAbi = (abi) => {
	if (!abi) {
		return 'Contract abi should not be empty';
	}

	try {
		JSON.parse(abi);
	} catch (err) {
		return 'Contract abi should be json';
	}

	return null;
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

const validateString = (value) => (typeof value === 'string' ? null : 'Value should be a string');
const validateAddress = (value) => (ChainValidation.is_object_id(value) ? null : 'Value should be in object id format');
const validateBool = (value) => (typeof value === 'boolean' ? null : 'Value should be a boolean');
const validateArray = (value) => ((typeof value === 'object' && value.length !== undefined) ? null : 'Value should be a boolean');
const validateBytes = (value) => (null);

export const validateByType = (value, type) => {
	// TODO
	// bytes
	// byte1-32
	if (!value) return 'Value should not be empty';

	let method = null;
	let isUint = null;
	let size = null;
	const intMark = type.search('int');
	if (type.search('string') !== -1) {
		method = validateString;
	} else if (type.search('address') !== -1) {
		method = validateAddress;
	} else if (type.search('bool') !== -1) {
		method = validateBool;
	} else if (intMark !== -1) {
		method = validateInt;
		isUint = (intMark === 1);
		size = type.sp
	} else {
		return 'value could not be validated';
	}

	const arrayMark = type.search('[]');
	if (arrayMark !== -1) {
    	const arrayError = validateArray(value);
		if (arrayError) return arrayError;
		const error = value.some((v) => {
			const error = method(v, isUint, size);
		})

		return error;
	}


};


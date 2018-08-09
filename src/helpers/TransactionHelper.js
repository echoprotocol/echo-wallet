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

export const validateName = (name) => {
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
	return null;
};

/* eslint-disable import/prefer-default-export */
export const validateCode = (code) => {
	if (!code) {
		return 'field should be not empty';
	}

	const hexNumber = parseInt(code, 16);
	if (hexNumber.toString(16) !== code.toLowerCase()) {
		return 'field should be hex string';
	}

	if (code.length % 2 !== 0) {
		return 'field should be hex string';
	}

	return null;
};

import validate from 'bitcoin-address-validation';

import { getHash } from './ContractHelper';

/**
 * @method isEthAddress
 * @param {String} address
 * @returns {boolean}
 */
export const isEthAddress = (address) => {
	if (/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
		return true;
	}

	address = address.replace('0x', '');
	const addressHash = getHash(address.toLowerCase());
	for (let i = 0; i < 40; i += 1) {
		if (
			(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
			|| (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
		) {
			return false;
		}
	}
	return true;
};

/**
 * @method isBtcAddress
 * @param {String} hex
 * @returns {boolean}
 */
export const isBtcAddress = (hex) => {
	try {
		const validationData = validate(hex);

		return validationData &&
			!validationData.testnet &&
			validationData.address;
	} catch (e) {
		return false;
	}
};

/**
 * @method isBackupAddress
 * @param {String} hex
 * @returns {boolean}
 */
export const isBackupAddress = (hex) => {
	try {
		const validationData = validate(hex);

		return validationData &&
			!validationData.bech32 &&
			!validationData.testnet &&
			validationData.address &&
			validationData.type === 'p2pkh';
	} catch (e) {
		return false;
	}
};

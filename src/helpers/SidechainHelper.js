import { getHash } from './ContractHelper';

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

export const isBtcAddress = (address) => /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);

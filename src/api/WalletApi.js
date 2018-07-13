import { PrivateKey } from 'echojs-lib';

import { FAUCET_ADDRESS } from '../constants/GlobalConstants';

export const generateKeyFromPassword = (accountName, role, password) => {
	const seed = `${accountName}${role}${password}`;
	const privateKey = PrivateKey.fromSeed(seed);
	const publicKey = privateKey.toPublicKey().toString();

	return { privateKey, publicKey };
};

export const validateAccountExist = (instance, accountName, shouldExist, limit = 50) => (
	instance.dbApi().exec('lookup_accounts', [accountName, limit])
		.then((result) => {
			if (!result.find((i) => i[0] === accountName) && shouldExist) {
				return 'Account not found';
			}

			if (result.find((i) => i[0] === accountName) && !shouldExist) {
				return 'Account name is already taken';
			}

			return null;
		})
);

export const createWallet = async (account, password) => {
	const { privateKey: ownerPrivateKey } = generateKeyFromPassword(account, 'owner', password);
	const { privateKey: activePrivateKey } = generateKeyFromPassword(account, 'active', password);
	const { privateKey: memoPrivateKey } = generateKeyFromPassword(account, 'memo', password);

	let response = await fetch(`${FAUCET_ADDRESS}/registration`, {
		method: 'post',
		mode: 'cors',
		headers: {
			Accept: 'application/json',
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			name: account,
			owner_key: ownerPrivateKey.toPublicKey().toPublicKeyString(),
			active_key: activePrivateKey.toPublicKey().toPublicKeyString(),
			memo_key: memoPrivateKey.toPublicKey().toPublicKeyString(),
		}),
	});

	response = await response.json();

	if (!response || (response && response.errors)) {
		throw response.errors.join();
	}

	// TODO set key in keychain
	return response;
};

export function unlockWallet(account, password) {

	return new Promise((resolve) => {
		resolve(password);
	});
}

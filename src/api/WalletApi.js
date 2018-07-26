import { PrivateKey } from 'echojs-lib';
import { EchoJSActions } from 'echojs-redux';


import { FAUCET_ADDRESS } from '../constants/GlobalConstants';

export const generateKeyFromPassword = (accountName, role, password) => {
	const seed = `${accountName}${role}${password}`;
	const privateKey = PrivateKey.fromSeed(seed);
	const publicKey = privateKey.toPublicKey().toString();

	return { privateKey, publicKey };
};

export const getKeyFromWif = (wif) => {
	try {
		const privateKey = PrivateKey.fromWif(wif);
		return privateKey;
	} catch (err) {
		return null;
	}
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
	const owner = generateKeyFromPassword(account, 'owner', password);
	const active = generateKeyFromPassword(account, 'active', password);
	const memo = generateKeyFromPassword(account, 'memo', password);

	let response = await fetch(`${FAUCET_ADDRESS}/registration`, {
		method: 'post',
		mode: 'cors',
		headers: {
			Accept: 'application/json',
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			name: account,
			owner_key: owner.publicKey,
			active_key: active.publicKey,
			memo_key: memo.publicKey,
		}),
	});

	response = await response.json();

	if (!response || (response && response.errors)) {
		throw response.errors.join();
	}

	return { owner, active, memo };
};

export const unlockWallet = async (account, password, roles = ['active', 'owner', 'memo']) => {

	const keys = {};
	const privateKey = getKeyFromWif(password);
	let key;

	if (privateKey) {
		key = {
			privateKey,
			publicKey: privateKey.toPublicKey().toString(),
		};
	}

	console.log(key)

	if (!account) { return keys; }

	account = account.toJS();
	roles.forEach((role) => {
		if (!privateKey) {
			key = generateKeyFromPassword(account.name, role, password);
		}

		switch (role) {
			case 'memo':
				if (account.options.memo_key === key.publicKey) {
					keys.memo = key;
				}
				break;
			case 'active':
				if (account.active.key_auths[0][0] === key.publicKey) {
					keys.active = key;
				}
				break;
			case 'owner':
				if (account.owner.key_auths[0][0] === key.publicKey) {
					keys.owner = key;
				}
				break;
			default: break;
		}
	});

	return keys;
};

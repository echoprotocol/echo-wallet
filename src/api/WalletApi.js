import { PrivateKey, FetchChain } from 'echojs-lib';


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

export const validateAccount = async (account, password, roles = ['active', 'owner', 'memo']) => {

	if (account) {
		let fromWif;
		let checkAllRoles = 0;
		try {
			fromWif = PrivateKey.fromWif(password);
		} catch (err) { console.log('err'); }
		const acc = await FetchChain('getAccount', account);
		let key;
		if (fromWif) {
			key = {
				privKey: fromWif,
				pubKey: fromWif.toPublicKey().toString(),
			};
		}

		roles.forEach((role) => {
			if (!fromWif) {
				key = generateKeyFromPassword(account, role, password);
			}
			if (acc) {
				if (role === 'memo') {
					if (acc.toJS().options.memo_key === key.publicKey) {
						checkAllRoles += 1;
					}
				} else if (role === 'active') {
					if (acc.toJS().active.key_auths[0][0] === key.publicKey) {
						checkAllRoles += 1;
					}
				} else if (role === 'owner') {
					if (acc.toJS().owner.key_auths[0][0] === key.publicKey) {
						checkAllRoles += 1;
					}
				}
			}
			return false;
		});
		if (checkAllRoles === 3) {
			return null;
		}
	}
	return 'auth error, name or pass invalid';
};

export function unlockWallet(account, password) {

	return new Promise((resolve) => {
		resolve(password);
	});
}

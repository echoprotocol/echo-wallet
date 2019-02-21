import { PrivateKey } from 'echojs-lib';

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

export const unlockWallet = async (account, password, roles = ['active', 'owner', 'memo']) => {

	const privateKey = getKeyFromWif(password);
	let key;

	if (privateKey) {
		key = {
			privateKey,
			publicKey: privateKey.toPublicKey().toString(),
		};
	}


	if (!account) { return {}; }

	account = account.toJS();
	return roles.reduce((keys, role) => {
		if (!privateKey) {
			key = generateKeyFromPassword(account.name, role, password);
		}

		switch (role) {
			case 'memo':
				if (account.options.memo_key === key.publicKey) {
					keys.memo = key;
				}
				break;
			case 'active': {
				const activeKey = account.active.key_auths.find(([active]) => active === key.publicKey);

				if (activeKey) {
					keys.active = key;
				}

				break;
			}
			case 'owner': {
				const ownerKey = account.owner.key_auths.find(([owner]) => owner === key.publicKey);

				if (ownerKey) {
					keys.owner = key;
				}

				break;
			}
			default: break;
		}

		return keys;
	}, {});
};


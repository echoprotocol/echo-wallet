import echo, { PrivateKey } from 'echojs-lib';

export const getKeyFromWif = (wif) => {
	try {
		const privateKey = PrivateKey.fromWif(wif);
		return privateKey;
	} catch (err) {
		return null;
	}
};

export const validateAccountExist = (accountName, shouldExist, limit = 50) => (
	echo.api.lookupAccounts(accountName, limit)
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

export const unlockWallet = (account, wif) => {
	if (!account) {
		return null;
	}

	const privateKey = PrivateKey.fromWif(wif);
	const publicKey = privateKey.toPublicKey().toString();

	if (account.getIn(['active', 'key_auths']).find(([key]) => key === publicKey)) {
		return { privateKey, publicKey };
	}

	return null;
};

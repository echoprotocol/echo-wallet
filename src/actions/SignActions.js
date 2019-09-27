import echo, { PrivateKey } from 'echojs-lib';

import Services from '../services';

/**
 * Get transaction signers
 *
 * @param account
 * @param keys
 * @param viewed
 *
 * @returns {Promise}
 */
const getSigners = async (account, keys, viewed = []) => {
	let weight = 0;
	let signers = [];

	account.active.key_auths.forEach(([k, w]) => {
		const key = keys
			.find(({ accountId, publicKey }) => (publicKey === k && accountId === account.id));
		if (key && weight < account.active.weight_threshold) {
			weight += w;
			signers.push(PrivateKey.fromWif(key.wif));
		}
	});

	if (weight >= account.active.weight_threshold) {
		return signers;
	}

	viewed.push(account.id);

	weight = await account.active.account_auths.reduce(async (wght, [id, w]) => {
		if (viewed.includes(id)) {
			return wght;
		}

		try {

			const signer = await echo.api.getObject(id);
			const accountSigners = await getSigners(signer, keys, viewed);
			signers = signers.concat(accountSigners);
			return wght + w;
		} catch (e) {
			//
			return wght;
		}
	}, weight);

	if (weight < account.active.weight_threshold) {
		throw new Error('Threshold is greater than the sum of keys weight available in Echo Desktop');
	}

	return signers;
};

/**
 * Sign transaction
 * @param signer
 * @param tr
 * @returns {Promise}
 */
export const signTransaction = async (accountId, tr, password) => {
	const signer = await echo.api.getObject(accountId);

	const transaction = {
		ref_block_num: 0,
		ref_block_prefix: 0,
		expiration: 0,
		operations: tr.operations,
		extensions: [],
	};

	const publicKeys = await echo.api.getPotentialSignatures(transaction);

	const keys = await Promise
		.all(publicKeys.map((k) => Services.getUserStorage().getWIFByPublicKey(k, { password })));

	const signers = await getSigners(signer, keys.filter((k) => k));
	signers.map((s) => tr.addSigner(s));
};

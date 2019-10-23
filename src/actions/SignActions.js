import echo, { PrivateKey } from 'echojs-lib';

import Services from '../services';
import { stringify } from 'querystring';

/**
 * Get transaction signers
 *
 * @param account
 * @param keys
 * @param viewed
 *
 * @returns {Promise}
 */
export const getSigners = async (account, keys, viewed = []) => {
	console.log(account, JSON.stringify(keys), viewed = []);
	let weight = 0;
	let signers = [];

	account.active.key_auths.forEach(([k, w]) => {
		const keyIndex = keys
			.findIndex(({ publicKey }) => (publicKey === k));

		if (keyIndex !== -1 && weight < account.active.weight_threshold) {
			weight += w;
			signers.push(PrivateKey.fromWif(keys[keyIndex].wif));
			keys.splice(1, keyIndex);
		}
	});
	console.log(weight);
	console.log(account.active.weight_threshold)
	if (weight >= account.active.weight_threshold) {
		return signers;
	}

	viewed.push(account.id);

	for (let i = 0; i < account.active.account_auths.length; i += 1) {
		const [id, w] = account.active.account_auths[i];

		if (!viewed.includes(id)) {
			try {
				/* eslint-disable no-await-in-loop */
				const [signer] = await echo.api.getFullAccounts([id]);
				const accountSigners = await getSigners(signer, keys, viewed);
				signers = signers.concat(accountSigners);
				weight += w;
			} catch (e) {
				//
			}
		}


	}

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

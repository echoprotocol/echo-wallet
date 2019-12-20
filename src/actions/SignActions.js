import { PrivateKey } from 'echojs-lib';

import Services from '../services';

/**
 * @method getSigners
 * Get transaction signers
 *
 * @param {Object} account
 * @param {Array} keys
 * @param {Array} viewed
 *
 * @returns {Promise<Array>}
 */
const getSigners = async (account, keys, viewed = []) => {
	let weight = 0;
	let signers = [];

	account.active.key_auths.forEach(([k, w]) => {
		const keyIndex = keys
			.findIndex(({ publicKey, accountId }) => (publicKey === k && accountId === account.id));

		if (keyIndex !== -1 && weight < account.active.weight_threshold) {
			weight += w;
			signers.push(PrivateKey.fromWif(keys[keyIndex].wif));
			keys.splice(1, keyIndex);
		}
	});
	if (weight >= account.active.weight_threshold) {
		return signers;
	}

	viewed.push(account.id);

	for (let i = 0; i < account.active.account_auths.length; i += 1) {
		const [id, w] = account.active.account_auths[i];

		if (!viewed.includes(id)) {
			try {
				// eslint-disable-next-line no-await-in-loop
				const [signer] = await Services.getEcho().api.getFullAccounts([id]);
				// eslint-disable-next-line no-await-in-loop
				const accountSigners = await getSigners(signer, keys, viewed);
				signers = signers.concat(accountSigners);
				weight += w;
			} catch (e) {
				//
			}
		}


	}

	if (weight < account.active.weight_threshold) {
		throw new Error('errors.sign_errors.not_enough_threshold_error');
	}

	return signers;
};

/**
 * @method signTransaction
 * Sign transaction
 * @param {String} signer
 * @param {Object} tr
 * @returns {Promise<>undefined}
 */
export const signTransaction = async (accountId, tr, password) => {
	const signer = await Services.getEcho().api.getObject(accountId);

	const transaction = {
		ref_block_num: 0,
		ref_block_prefix: 0,
		expiration: 0,
		operations: tr.operations,
		extensions: [],
	};

	const publicKeys = await Services.getEcho().api.getPotentialSignatures(transaction);

	const keys = (await Promise
		.all(publicKeys.map((k) => Services.getUserStorage().getAllPossibleWIFs(k, { password }))))
		.reduce((acc, val) => [...acc, ...val], []);

	const signers = await getSigners(signer, keys.filter((k) => k));
	signers.map((s) => tr.addSigner(s));
};

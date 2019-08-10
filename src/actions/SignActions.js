import { PrivateKey } from 'echojs-lib';
import { EchoJSActions } from 'echojs-redux';

import Services from '../services';
import { toastError } from '../helpers/ToastHelper';

/**
 * Get transaction signers
 *
 * @param account
 * @param keys
 * @param viewed
 *
 * @returns {Promise}
 */
const getSigners = (account, keys, viewed = []) => async (dispatch) => {
	let weight = 0;
	let signers = [];

	try {
		account.getIn(['active', 'key_auths']).forEach(([k, w]) => {
			const key = keys
				.find(({ accountId, publicKey }) => (publicKey === k && accountId === account.get('id')));
			if (key && weight < account.getIn(['active', 'weight_threshold'])) {
				weight += w;
				signers.push(PrivateKey.fromWif(key.wif));
			}
		});

		if (weight >= account.getIn(['active', 'weight_threshold'])) {
			return signers;
		}

		viewed.push(account.get('id'));

		weight = await account.getIn(['active', 'account_auths']).reduce(async (wght, [id, w]) => {
			if (viewed.includes(id)) {
				return wght;
			}

			try {
				const signer = await dispatch(EchoJSActions.fetch(id));
				const accountSigners = await dispatch(getSigners(signer, keys, viewed));
				signers = signers.concat(accountSigners);
				return wght + w;
			} catch (e) {
				//
				return wght;
			}
		}, weight);

		if (weight < account.getIn(['active', 'weight_threshold'])) {
			throw new Error('Threshold is greater than the sum of keys weight available in Echo Desktop');
		}
	} catch (error) {
		toastError(`Transaction wasn't completed. ${error.message}`);
		return null;
	}

	return signers;
};

/**
 * Sign transaction
 * @param signer
 * @param tr
 * @returns {Promise}
 */
export const signTransaction = (account, tr, password) => async (dispatch) => {
	const signer = await dispatch(EchoJSActions.fetch(account));
	const { pubkeys: publicKeys } = await tr.get_potential_signatures();

	const keys = await Promise
		.all(publicKeys.map((k) => Services.getUserStorage().getWIFByPublicKey(k, { password })));

	const signers = await dispatch(getSigners(signer, keys.filter((k) => k)));
	if (!signers) return false;
	signers.map((s) => tr.add_signer(s));
	return true;
};

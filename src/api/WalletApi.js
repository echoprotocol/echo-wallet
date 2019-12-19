import { PrivateKey } from 'echojs-lib';
import { CUSTOM_NODE_BLOCKS_MAX_DIFF } from '../constants/GlobalConstants';

import Services from '../services';

/**
 * @method getKeyFromWif
 *
 * @param {String} wif
 * @returns {(null | Object)}
 */
export const getKeyFromWif = (wif) => {
	try {
		const privateKey = PrivateKey.fromWif(wif);
		return privateKey;
	} catch (err) {
		return null;
	}
};

/**
 * @method validateAccountExist
 *
 * @param {String} accountName
 * @param {Boolean} shouldExist
 * @param {Number} limit
 * @returns {(null | String)}
 */
export const validateAccountExist = (accountName, shouldExist, limit = 50) => (
	Services.getEcho().api.lookupAccounts(accountName, limit)
		.then((result) => {
			if (!result.find((i) => i[0] === accountName) && shouldExist) {
				return 'errors.account_errors.account_not_found_error';
			}

			if (result.find((i) => i[0] === accountName) && !shouldExist) {
				return 'errors.account_errors.name_already_taken_error';
			}

			return null;
		})
);


/**
 * @method unlockWallet
 *
 * @param {Object} account
 * @param {String} wif
 * @returns {(null | Object)}
 */
export const unlockWallet = (account, wif) => {
	if (!account) {
		return null;
	}

	const privateKey = PrivateKey.fromWif(wif);
	const publicKey = privateKey.toPublicKey().toString();

	if (account.active.key_auths.find(([key]) => key === publicKey)) {
		return { privateKey, publicKey };
	}

	return null;
};

/**
 *
 * @param echoInstance
 * @returns {Promise<null|*>}
 */
const isRegistrar = async (echoInstance) => {
	try {
		return await echoInstance.api.getRegistrar();
	} catch (e) {
		return null;
	}
};

/**
 *
 * @param echoInstance
 * @returns {Promise<string|null>}
 */
export const nodeRegisterValidate = async (echoInstance) => {
	if (!echoInstance.isConnected) {
		return 'errors.node_errors.not_connect_error';
	}

	if (!echoInstance.api) {
		return 'errors.node_errors.api_not_available';
	}

	const customNodeChainId = await echoInstance.api.getChainId();
	const baseNodeChainId = await Services.getEcho().api.getChainId();

	if (customNodeChainId !== baseNodeChainId) {
		return 'errors.node_errors.invalid_chacin_id_error';
	}

	const customNodeDynamic = await echoInstance.api.getDynamicGlobalProperties();
	const baseNodeDynamic = await Services.getEcho().api.getDynamicGlobalProperties();
	const diff = baseNodeDynamic.head_block_number - customNodeDynamic.head_block_number;

	if (diff > CUSTOM_NODE_BLOCKS_MAX_DIFF) {
		return 'errors.node_errors.not_synchronized_error';
	}

	const accountId = await isRegistrar(echoInstance);

	if (!accountId) {
		return 'errors.node_errors.doesnt_have_registrar_error';
	}

	return null;
};

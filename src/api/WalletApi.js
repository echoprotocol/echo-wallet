import echo, { PrivateKey } from 'echojs-lib';
import { CUSTOM_NODE_BLOCKS_MAX_DIFF } from '../constants/GlobalConstants';

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

const isRegistrar = async (echoInstance) => {
	try {
		return await echoInstance.api.getRegistrar();
	} catch (e) {
		return null;
	}
};

export const nodeRegisterValidate = async (echoInstance) => {
	if (!echoInstance.isConnected) {
		return 'Node is not connected';
	}

	if (!echoInstance.api) {
		return 'Api is not available';
	}

	const customNodeChainId = await echoInstance.api.getChainId();
	const baseNodeChainId = await echo.api.getChainId();

	if (customNodeChainId !== baseNodeChainId) {
		return 'Chain id is not correct. Check your network node';
	}

	const customNodeDynamic = await echoInstance.api.getDynamicGlobalProperties();
	const baseNodeDynamic = await echo.api.getDynamicGlobalProperties();
	const diff = baseNodeDynamic.head_block_number - customNodeDynamic.head_block_number;

	if (diff > CUSTOM_NODE_BLOCKS_MAX_DIFF) {
		return 'Node is not synchronized';
	}

	const accountId = await isRegistrar(echoInstance);

	if (!accountId) {
		return 'Node does not have registrar';
	}

	return null;
};

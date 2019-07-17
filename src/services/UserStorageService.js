import StorageService from './StorageService';
import Storage from '../logic-components/db/Storage';
import { DB_NAME, STORE } from '../constants/GlobalConstants';
import ManualSchemeService from './schemes/ManualSchemeService';
import AutoSchemeService from './schemes/AutoSchemeService';
import Network from '../logic-components/db/models/network';
import Key from '../logic-components/db/models/key';

const storageService = new StorageService(new Storage(DB_NAME, STORE));
const manualSchemeService = new ManualSchemeService(storageService);
const autoSchemeService = new AutoSchemeService(storageService);

class UserStorageService {

	/**
	 *
	 * @return {Promise.<void>}
	 */
	async init() {

		await storageService.init();
		this.scheme = null;

	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async createDB(password) {
		await storageService.createDB(password);
	}

	/**
	 *
	 * @return {Promise.<boolean>}
	 */
	async doesDBExist() {
		const result = await storageService.doesDBExist();
		return result;
	}

	/**
	 *
	 * @param {String} networkId
	 * @return {Promise.<void>}
	 */
	setNetworkId(networkId) {
		this.networkId = networkId;
	}

	/**
	 *
	 * @return {String}
	 */
	getNetworkId() {
		return this.networkId;
	}

	checkNetwork() {
		if (!this.getNetworkId()) {
			throw new Error('Network ID is required');
		}
	}

	/**
	 *
	 * @param {UserStorageService.SCHEMES.AUTO|UserStorageService.SCHEMES.MANUAL} scheme AUTO|MANUAL
	 * @param {String?} password
	 * @return {Promise.<void>}
	 */
	async setScheme(scheme, password) {

		this.scheme = scheme;
		await autoSchemeService.resetPrivateStorage();

		switch (scheme) {
			case UserStorageService.SCHEMES.AUTO:
				if (!password) {
					throw new Error('Password is required.');
				}
				await autoSchemeService.setEncryptionHash(password);
				break;
			case UserStorageService.SCHEMES.MANUAL:
				break;
			default:
				throw new Error('Unknown scheme');
		}

	}

	getCurrentScheme() {
		switch (this.scheme) {
			case UserStorageService.SCHEMES.AUTO:
				return autoSchemeService;
			case UserStorageService.SCHEMES.MANUAL:
				return manualSchemeService;
			default:
				throw new Error('Unknown scheme');
		}
	}

	/**
	 *
	 * @return {Promise.<void>}
	 */
	async resetCurrentScheme() {
		switch (this.scheme) {
			case UserStorageService.SCHEMES.AUTO:
				await this.getCurrentScheme().resetPrivateStorage();
				break;
			case UserStorageService.SCHEMES.MANUAL:
				break;
			default:
				break;
		}

		this.scheme = null;
	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<boolean>}
	 */
	async isMasterPassword(password) {
		this.checkNetwork();

		try {
			const decryptedData = await this.getCurrentScheme().getDecryptedData({ password });
			return !!decryptedData;
		} catch (error) {
			return false;
		}

	}

	/**
	 *
	 * @param {Key} key
	 * @param params
	 * @return {Promise.<void>}
	 */
	async addKey(key, params) {

		if (!(key instanceof Key)) {
			throw new Error('Key object is required');
		}

		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		network.addKey(key);

		await this.updateDB(decryptedData, params);

		console.info(`[DB] Key added. Public Key: ${JSON.stringify(key.publicKey)}. Network: ${networkId}`);
	}

	/**
	 *
	 * @param keys
	 * @param params
	 * @return {Promise.<void>}
	 */
	async removeKeys(keys, params) {
		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		const resultKeys = network.getAllKeys().filter((key) => !keys.includes(key.publicKey));

		network.updateKeys(resultKeys);

		await this.updateDB(decryptedData, params);

		console.info(`[DB] Keys removed. Public Keys: ${JSON.stringify(keys)}. Network: ${networkId}`);
	}

	/**
	 *
	 * @param {Object} params
	 * @return {Promise.<Array.String>}
	 */
	async getAllPublicKeys(params) {

		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		return network.getAllKeys().map((key) => key.publicKey);
	}

	/**
	 *
	 * @param {String} accountId
	 * @param {Object?} params
	 * @return {Promise.<Key>}
	 */
	async getAllWIFKeysForAccount(accountId, params) {

		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		return network.getAllKeys().filter((key) => key.accountId === accountId);
	}

	/**
	 *
	 * @param {String} publicKey
	 * @param {Object?} params
	 * @return {Promise.<Key>}
	 */
	async getWIFByPublicKey(publicKey, params) {
		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		return network.getAllKeys().find((key) => publicKey === key.publicKey);
	}

	/**
	 *
	 * @param {String} wif
	 * @param {String} accountId
	 * @param {Object?} params
	 * @return {Promise.<Key>}
	 */
	async isWIFAdded(wif, accountId, params) {
		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		return network.getAllKeys().find((key) => (wif === key.wif) && (accountId === key.accountId));
	}

	/**
	 *
	 * @param decryptedData
	 * @param params
	 * @return {Promise.<void>}
	 */
	async updateDB(decryptedData, params) {

		const currentScheme = this.getCurrentScheme();

		await currentScheme.updateDB(decryptedData, params);

	}

	/**
	 *
	 * @return {Promise.<void>}
	 */
	async deleteDB() {

		await storageService.deleteDB();

	}

	/**
	 *
	 * @param {String} networkId
	 * @param {String} decryptedData
	 * @return {Promise.<Network>}
	 */
	async getNetworkFromDecryptedData(networkId, decryptedData) {

		let network;

		if (!decryptedData.data.networks) {
			decryptedData.data.networks = {};
			network = Network.create([]);
		} else if (!decryptedData.data.networks[networkId]) {
			network = Network.create([]);
		} else {
			const rawNetwork = decryptedData.data.networks[networkId];
			network = Network
				.create(rawNetwork.keys.map((key) => Key.create(key.publicKey, key.wif, key.accountId)));
		}

		decryptedData.data.networks[networkId] = network;

		return network;

	}

}

UserStorageService.SCHEMES = {
	AUTO: 'AUTO',
	MANUAL: 'MANUAL',
};

export default UserStorageService;

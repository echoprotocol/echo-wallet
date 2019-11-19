import StorageService from './StorageService';
import Storage from '../logic-components/db/Storage';
import { DB_NAME, STORE, USER_STORAGE_SCHEMES } from '../constants/GlobalConstants';
import ManualSchemeService from './schemes/ManualSchemeService';
import AutoSchemeService from './schemes/AutoSchemeService';
import Network from '../logic-components/db/models/network';
import Key from '../logic-components/db/models/key';

const storageService = new StorageService(new Storage(DB_NAME, STORE));
const manualSchemeService = new ManualSchemeService(storageService);
const autoSchemeService = new AutoSchemeService(storageService);

class UserStorageService {

	/**
	 * @method init
	 * @return {Promise.<void>}
	 */
	async init() {

		await storageService.init();
		this.scheme = null;

	}

	/**
	 * @method createDB
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async createDB(password) {
		await storageService.createDB(password);
	}

	/**
	 * @method doesDBExist
	 * @return {Promise.<boolean>}
	 */
	async doesDBExist() {
		const result = await storageService.doesDBExist();
		return result;
	}

	/**
	 * @method setNetworkId
	 * @param {String} networkId
	 * @return {Promise.<void>}
	 */
	setNetworkId(networkId) {
		this.networkId = networkId;
	}

	/**
	 * @method getNetworkId
	 * @return {String}
	 */
	getNetworkId() {
		return this.networkId;
	}

	/**
	 * @method checkNetwork
	 * @returns {undefined}
	 */
	checkNetwork() {
		if (!this.getNetworkId()) {
			throw new Error('Network ID is required');
		}
	}

	/**
	 * @method setScheme
	 * @param {USER_STORAGE_SCHEMES.AUTO|USER_STORAGE_SCHEMES.MANUAL} scheme AUTO|MANUAL
	 * @param {String?} password
	 * @return {Promise.<void>}
	 */
	async setScheme(scheme, password) {

		this.scheme = scheme;
		await autoSchemeService.resetPrivateStorage();

		switch (scheme) {
			case USER_STORAGE_SCHEMES.AUTO:
				if (!password) {
					throw new Error('Password is required.');
				}
				await autoSchemeService.setEncryptionHash(password);
				break;
			case USER_STORAGE_SCHEMES.MANUAL:
				break;
			default:
				throw new Error('Unknown scheme');
		}

	}

	/**
	 * @method getCurrentScheme
	 * @returns {Object}
	 */
	getCurrentScheme() {
		switch (this.scheme) {
			case USER_STORAGE_SCHEMES.AUTO:
				return autoSchemeService;
			case USER_STORAGE_SCHEMES.MANUAL:
				return manualSchemeService;
			default:
				throw new Error('Unknown scheme');
		}
	}

	/**
	 * @method resetCurrentScheme
	 * @return {Promise.<void>}
	 */
	async resetCurrentScheme() {
		switch (this.scheme) {
			case USER_STORAGE_SCHEMES.AUTO:
				await this.getCurrentScheme().resetPrivateStorage();
				break;
			case USER_STORAGE_SCHEMES.MANUAL:
				break;
			default:
				break;
		}

		this.scheme = null;
	}

	/**
	 * @method isMasterPassword
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
	 * @method addKey
	 * @param {Key} key
	 * @param {Array} params
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
	}

	/**
	 * @method updateKeys
	 * @param {Array<Key>} keys
	 * @param {Array} params
	 * @return {Promise.<void>}
	 */
	async updateKeys(keys, params) {
		const { accountId } = keys;
		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		const storageKeys = network.getAllKeys().filter((keyItem) => keyItem.accountId !== accountId);
		network.updateKeys([...storageKeys, ...keys]);

		await this.updateDB(decryptedData, params);
	}

	/**
	 * @method removeKeys
	 * @param keys
	 * @param params
	 * @return {Promise.<void>}
	 */
	async removeKeys(keys, params) {
		const { accountId } = params;

		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);
		const resultKeys = network.getAllKeys().filter((key) =>
			!keys.includes(key.publicKey) && key.accountId === accountId);
		network.updateKeys(resultKeys);

		await this.updateDB(decryptedData, params);
	}

	/**
	 * @method getAllPublicKeys
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
	 * @method getAllWIFKeysForAccount
	 * @param {String} accountId
	 * @param {Object?} params
	 * @return {Promise.<Key>}
	 */
	async getAllWIFKeysForAccount(accountId, params) {
		if (!this.scheme) {
			this.setScheme(USER_STORAGE_SCHEMES.MANUAL);
		}
		this.checkNetwork();

		const decryptedData = await this.getCurrentScheme().getDecryptedData(params);
		const networkId = this.getNetworkId();
		const network = await this.getNetworkFromDecryptedData(networkId, decryptedData);

		return network.getAllKeys().filter((key) => key.accountId === accountId);
	}

	/**
	 * @method getWIFByPublicKey
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
	 * @method isWIFAdded
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
	 * @method updateDB
	 * @param decryptedData
	 * @param params
	 * @return {Promise.<void>}
	 */
	async updateDB(decryptedData, params) {

		const currentScheme = this.getCurrentScheme();

		await currentScheme.updateDB(decryptedData, params);

	}

	/**
	 * @method deleteDB
	 * @return {Promise.<void>}
	 */
	async deleteDB() {

		await storageService.deleteDB();

	}

	/**
	 * @method getNetworkFromDecryptedData
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
				.create(rawNetwork.keys.map((key) =>
					Key.create(key.publicKey, key.wif, key.accountId, key.type)));
		}

		decryptedData.data.networks[networkId] = network;

		return network;

	}

}

export default UserStorageService;

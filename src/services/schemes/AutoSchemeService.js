/* eslint-disable no-underscore-dangle */
import CryptoService from '../CryptoService';
import PrivateStorage from '../../logic-components/PrivateStorage';

class AutoSchemeService {

	/**
	 *
	 * @param {StorageService} storageService
	 */
	constructor(storageService) {
		this.storageService = storageService;
		this._privateStorage = null;
	}

	/**
	 *
	 * @param db
	 * @return {Promise.<void>}
	 */
	async updateDB(db) {
		const encHash = this.getEncHash();
		await this.storageService.updateDBByEncryptionHash(db, encHash);
	}

	getEncHash() {
		if (!this._privateStorage) {
			throw new Error('Private storage doesn\'t set');
		}

		const decrypted = CryptoService.decryptData(
			this._privateStorage.protectedPrivateKey,
			this._privateStorage.encryptedEncryptionHash,
			{ IV: this._privateStorage.protectedIV },
		);

		return decrypted.toString('hex');
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async getDecryptedData() {

		const encHash = this.getEncHash();

		const decryptedData = await this.storageService.decryptDBByEncryptionHash(encHash);

		return JSON.parse(decryptedData.toString('utf8'));
	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async setEncryptionHash(password) {

		if (this._privateStorage) {
			throw new Error('PrivateStorage is enabled. Please reset it');
		}

		const encHash = await this.storageService.getEncHash(password);

		const protectedPrivateKey = CryptoService.randomBytes(32).toString('hex');
		const protectedIV = CryptoService.randomBytes(16).toString('hex');
		const encryptedEncryptionHash = CryptoService.encryptData(protectedPrivateKey, Buffer.from(encHash, 'hex'), { IV: protectedIV });

		this._privateStorage = new PrivateStorage(
			protectedPrivateKey,
			protectedIV,
			encryptedEncryptionHash,
		);

	}

	resetPrivateStorage() {
		this._privateStorage = null;
	}

}

export default AutoSchemeService;

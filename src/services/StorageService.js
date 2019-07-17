import DB from '../logic-components/db/models/db';
import CryptoService from './CryptoService';
import { ENCRYPTED_DB_NAME, SCRYPT_ALGORITHM_PARAMS, ALGORITHM_IV_BYTES_LENGTH } from '../constants/GlobalConstants';

class StorageService {

	/**
	 *
	 * @param {Storage} storage
	 */
	constructor(storage) {
		this.storage = storage;
	}

	async init() {

		await this.storage.init();

		return true;

	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<*>}
	 */
	async decryptDBByPassword(password) {

		const db = await this.getDB();

		const encHash = await CryptoService.derivePassword(password, db.header);
		const decrypted = CryptoService.decryptData(encHash, db.encryptedData, db.header);

		return decrypted;

	}

	/**
	 *
	 * @return {Promise.<DB>}
	 */
	async getDB() {

		const dbData = await this.storage.get(ENCRYPTED_DB_NAME);

		const db = DB.createDB(dbData.header, dbData.encryptedData);

		return db;
	}

	/**
	 *
	 * @param {String} encHash
	 * @return {Promise.<*>}
	 */
	async decryptDBByEncryptionHash(encHash) {

		const db = await this.getDB();

		const decrypted = CryptoService.decryptData(encHash, db.encryptedData, db.header);

		return decrypted;

	}

	/**
	 *
	 * @return {Promise.<boolean>}
	 */
	async doesDBExist() {
		const db = await this.storage.get(ENCRYPTED_DB_NAME);

		return !!db;
	}

	/**
	 *
	 * @return {{
	 *      version: number,
	 *      created_at: string,
	 *      salt: string,
	 *      N,
	 *      r: number,
	 *      p: number,
	 *      l: number,
	 *      IV: string
	 * }}
	 */
	static generateNewHeader() {

		const header = {
			version: 1,
			created_at: (new Date()).toISOString(),
			salt: CryptoService.randomBytes(SCRYPT_ALGORITHM_PARAMS.SALT_BYTES_LENGTH).toString('hex'),
			N: SCRYPT_ALGORITHM_PARAMS.N,
			r: SCRYPT_ALGORITHM_PARAMS.r,
			p: SCRYPT_ALGORITHM_PARAMS.p,
			l: SCRYPT_ALGORITHM_PARAMS.l,
			IV: CryptoService.randomBytes(ALGORITHM_IV_BYTES_LENGTH).toString('hex'),
		};

		return header;
	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise}
	 */
	async getEncHash(password) {
		const db = await this.getDB();

		const encHash = await CryptoService.derivePassword(password, db.header);

		return encHash;

	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async createDB(password) {

		const doesDBExist = await this.doesDBExist();

		if (doesDBExist) {
			throw new Error('createDB error. DB exists.');
			// await this.storage.delete(ENCRYPTED_DB_NAME);
		}

		const header = StorageService.generateNewHeader();

		const newDB = await DB.createDB(header);

		const encHash = await CryptoService.derivePassword(password, newDB.header);

		const decryptedData = {
			random_key: CryptoService.randomBytes(256).toString('hex'),
			data: {},
		};

		const encryptedData = CryptoService.encryptData(encHash, Buffer.from(JSON.stringify(decryptedData), 'utf8'), newDB.header);

		newDB.setEncryptedData(encryptedData);

		await this.saveDb(newDB);

		console.info(`[DB] Created. DB: ${ENCRYPTED_DB_NAME}`);

		return true;
	}

	/**
	 *
	 * @return {Promise.<void>}
	 */
	async deleteDB() {
		await this.storage.delete(ENCRYPTED_DB_NAME);
	}

	/**
	 *
	 * @param {Object} decryptedData
	 * @param {String} encHash - hex
	 * @return {Promise.<void>}
	 */
	async updateDBByEncryptionHash(decryptedData, encHash) {

		const db = await this.getDB();
		const encryptedData = CryptoService.encryptData(encHash, Buffer.from(JSON.stringify(decryptedData), 'utf8'), db.header);

		db.setEncryptedData(encryptedData);

		await this.saveDb(db);

	}

	/**
	 *
	 * @param {Object} decryptedData
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async updateDBByPassword(decryptedData, password) {

		const db = await this.getDB();

		const encHash = await CryptoService.derivePassword(password, db.header);
		const encryptedData = CryptoService.encryptData(encHash, Buffer.from(JSON.stringify(decryptedData), 'utf8'), db.header);

		db.setEncryptedData(encryptedData);

		await this.saveDb(db);

	}

	/**
	 *
	 * @param {DB} preparedDB
	 * @return {Promise.<void>}
	 */
	async saveDb(preparedDB) {
		await this.storage.set(ENCRYPTED_DB_NAME, preparedDB);
	}

}

export default StorageService;

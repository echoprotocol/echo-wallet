import crypto from 'crypto';
import scrypt from 'scrypt-js';
import { PrivateKey, ED25519, constants } from 'echojs-lib';
import bs58 from 'bs58';
import random from 'crypto-random-string';
import { ACTIVE_KEY, ALGORITHM, RANDOM_SIZE } from '../constants/GlobalConstants';

class CryptoService {

	/**
	 * @method encryptData
	 * @param {String} encHash - hex
	 * @param {Buffer} decryptedData
	 * @param {Object} header
	 * @return {String} - hex
	 */
	static encryptData(encHash, decryptedData, header) {

		const checksum = crypto.createHash('sha256').update(decryptedData).digest('hex').slice(0, 4);

		const payload = Buffer.concat([Buffer.from(checksum, 'hex'), decryptedData]);

		const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(encHash, 'hex'), Buffer.from(header.IV, 'hex'));

		let encrypted = cipher.update(payload.toString('hex'), 'hex', 'hex');

		encrypted += cipher.final('hex');

		return encrypted;
	}


	/**
	 * @method decryptData
	 * @param {String} encHash
	 * @param {String} encryptedData - hex
	 * @param header
	 */
	static decryptData(encHash, encryptedData, header) {

		const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(encHash, 'hex'), Buffer.from(header.IV, 'hex'));

		let decrypted = decipher.update(encryptedData, 'hex', 'hex');
		decrypted += decipher.final('hex');

		const checksum = decrypted.slice(0, 4);
		const decryptedStrData = decrypted.slice(4);

		let newChecksum = crypto.createHash('sha256').update(decryptedStrData, 'hex').digest('hex').slice(0, 4);

		newChecksum = newChecksum.slice(0, 4);


		if (checksum.toString('hex') !== newChecksum) {
			throw new Error('Invalid key, could not decrypt message (2)');
		}

		return Buffer.from(decryptedStrData, 'hex');
	}

	/**
	 * @method derivePassword
	 * @param {String} password
	 * @param {Object} header //TODO:: descr
	 * @return {Promise}
	 */
	static async derivePassword(password, header) {
		return new Promise((resolve, reject) => {
			const passwordHash = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
			const passwordHashBuffer = Buffer.from(passwordHash, 'hex');
			const saltBuffer = Buffer.from(header.salt, 'hex');
			const t1 = Date.now();

			scrypt(
				passwordHashBuffer,
				saltBuffer,
				header.N,
				header.r,
				header.p,
				header.l,
				(error, progress, key) => {

					if (error) {
						console.error(`[SCRYPT] Error: ${error}`);
						return reject(error);
					}

					if (key) {
						return resolve(Buffer.from(key).toString('hex'));
					}

					return false;

				},
			);

		});

	}

	/**
	 * @method randomBytes
	 * @param {Number} bytes
	 * @return {void|Buffer}
	 */
	static randomBytes(bytes) {
		return crypto.randomBytes(bytes);
	}

	/**
	 *  @method generateWIF
	 *
	 * 	Generate random string and private key from this seed.
	 *
	 *  @return {String} privateKeyWIF
	 */
	static generateWIF() {
		const privateKey = PrivateKey.fromSeed(random(RANDOM_SIZE));

		return privateKey.toWif();
	}

	/**
	 *  @method isWIF
	 *
	 *  Check string is WIF.
	 *
	 *  @param {String} passwordOrWIF
	 *
	 *  @return {Boolean} isWIF
	 */
	static isWIF(passwordOrWIF) {
		try {
			PrivateKey.fromWif(passwordOrWIF);
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 *  @method generateEchoRandKey
	 *
	 * 	Generate random string and private key from this seed.
	 *
	 *  @return {String} echoRandKey
	 */
	static generateEchoRandKey() {
		return `${constants.CHAIN_CONFIG.ADDRESS_PREFIX}${bs58.encode(ED25519.createKeyPair().publicKey)}`;
	}

	/**
	 *  @method getPublicKey
	 *
	 *  Generate public key from seed, using in desktop app.
	 *
	 *  @param {String} username
	 *  @param {String} password
	 *  @param {String} role - optional
	 *
	 *  @return {String} publicKey
	 */
	static getPublicKey(username, password, role = ACTIVE_KEY) {
		const seed = `${username}${role}${password}`;
		const privateKey = PrivateKey.fromSeed(seed);
		return privateKey.toPublicKey().toString();
	}

}

export default CryptoService;

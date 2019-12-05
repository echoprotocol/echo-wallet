import { PrivateKey, ED25519 } from 'echojs-lib';
import bs58 from 'bs58';


class AuthApi {

	/**
	 *  @method generateEchoRandKey
	 *
	 *  @return {Object}
	 */
	static generateEchoRandKey() {
		const EchoRandKeyBuffer = ED25519.createKeyPair();
		const echoRandPublicKey = EchoRandKeyBuffer.publicKey;
		return {
			privateKey: EchoRandKeyBuffer.privateKey,
			publicKey: `ECHO${bs58.encode(echoRandPublicKey)}`,
		};
	}

	/**
	 * @method registerAccount
	 *
	 * @param {Object} echoInstanceApi
	 * @param {String} accountName
	 * @param {String} publicKey
	 */
	static async registerAccount(echoInstanceApi, accountName, publicKey) {
		try {
			await echoInstanceApi.registerAccount(accountName, publicKey, publicKey);
			return true;
		} catch (error) {
			throw new Error(error.message);
		}
	}

}

export default AuthApi;

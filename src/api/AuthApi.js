import echo, { PrivateKey, ED25519 } from 'echojs-lib';
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
     *  @method registerAccount
     *
     * 	@param  {String} accountName
     * 	@param  {String} wif
     * 	@param  {Object} echoInstanceApi
     *
     *  @return {Object}
     */
	static async registerAccount(echoInstanceApi, accountName, wif) {
		const privateKey = PrivateKey.fromWif(wif);
		const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();

		try {
			await echoInstanceApi.registerAccount(accountName, publicKey, publicKey);
		} catch (error) {
			throw new Error(error.message);
		}

		return { privateKey, publicKey };
	}

}

export default AuthApi;

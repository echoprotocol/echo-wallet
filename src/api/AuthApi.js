import { ED25519 } from 'echojs-lib';
import bs58 from 'bs58';

import { generateKeyFromPassword } from './WalletApi';

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
     *  @param  {Object} instance
     * 	@param  {String} accountName
     * 	@param  {String} password
     *
     *  @return {Object}
     */
	static async registerAccount(instance, accountName, password) {
		const active = generateKeyFromPassword(accountName, 'active', password);
		const echoRandKey = this.generateEchoRandKey();

		const error = await instance.registrationApi().exec('register_account', [() => {}, accountName, active.publicKey, echoRandKey.publicKey]);

		if (error) {
			throw error;
		}

		return {
			active,
			echoRandKey,
		};
	}

}

export default AuthApi;

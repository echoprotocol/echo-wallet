import { ED25519 } from 'echojs-lib';
import bs58 from 'bs58';

import { generateKeyFromPassword, generateECDSAPublicKey } from './WalletApi';

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
			publicKey: `DET${bs58.encode(echoRandPublicKey)}`,
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
		const memo = generateECDSAPublicKey(accountName, 'memo', password);
		const echoRandKey = this.generateEchoRandKey();

		const error = await instance.registrationApi().exec('register_account', [() => {}, accountName, active.publicKey, active.publicKey, memo.publicKey, echoRandKey.publicKey]);

		if (error) {
			throw error;
		}

		return {
			active,
			memo,
			echoRandKey,
		};
	}

}

export default AuthApi;

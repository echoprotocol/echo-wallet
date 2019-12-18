import { serializers, PrivateKey } from 'echojs-lib';
import crypto from 'crypto';


class NodeFileEncryptor {

	/**
	 *
	 * @param {String} password
	 */
	static hashPassword(password) {

		const hash = crypto.createHash('sha512');
		const data = hash.update(password, 'utf-8');
		const sha512Result = data.digest('hex');

		return sha512Result;
	}

	/**
	 *
	 * @param {String} passwordHash
	 * @param {String} hex
	 */
	static getEncryptedHex(passwordHash, hex) {
		const iv = Buffer.from(passwordHash.substring(64, 96), 'hex');
		const key = Buffer.from(passwordHash.substring(0, 64), 'hex');
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		let encrypted = cipher.update(hex, 'hex', 'hex');
		encrypted += cipher.final('hex');

		return encrypted;
	}


	/**
	 *
	 * @param {Array.<{wif, account}>} echornadKeys
	 * @param {Array} sidechainKeys
	 */
	static getSerializedKeysHex(echornadKeys, sidechainKeys) {

		const sidechainAccountKey = serializers.collections.struct({
			account: serializers.chain.ids.protocol.accountId,
			key: serializers.basic.bytes(32),
		});

		const echorandAccountKey = serializers.collections.struct({
			account: serializers.chain.ids.protocol.accountId,
			key: serializers.basic.bytes(32),
		});

		const echoKeyConfig = serializers.collections.struct({
			echorand_accounts_keys: serializers.collections.vector(echorandAccountKey),
			sidechain_accounts_keys: serializers.collections.vector(sidechainAccountKey),
		});

		const hex = echoKeyConfig.serialize({
			echorand_accounts_keys: echornadKeys.map(({ key, id }) => {
				const pKey = PrivateKey.fromWif(key);
				return {
					account: id,
					key: pKey.toHex(),
				};
			}),
			sidechain_accounts_keys: sidechainKeys,
		}).toString('hex');

		return hex;
	}

	/**
	 *
	 * @param {String} password
	 * @param {Array.<{wif, account}>} echornadKeys
	 * @param {Array} sidechainKeys
	 */
	static getFileBytes(password, echornadKeys = [], sidechainKeys = []) {

		const passwordHash = NodeFileEncryptor.hashPassword(password);
		const hex = NodeFileEncryptor.getSerializedKeysHex(echornadKeys, sidechainKeys);
		const encrypted = NodeFileEncryptor.getEncryptedHex(passwordHash, hex);

		const encriptionArrayBytes = encrypted.split(/(?=(?:..)*$)/);

		const serializableEncryption = serializers.collections.struct({
			sha512Key: serializers.basic.bytes(passwordHash.length / 2),
			encryption: serializers.collections.vector(serializers.basic.bytes(1)),
		});

		const checkBytesHex = serializableEncryption.serialize({
			sha512Key: passwordHash,
			encryption: encriptionArrayBytes,
		}).toString('hex');

		const hash = crypto.createHash('sha512');
		const data = hash.update(checkBytesHex, 'hex', 'hex');
		const checkBytesResult = data.digest('hex');

		const fileHex = serializableEncryption.serialize({
			sha512Key: checkBytesResult,
			encryption: encriptionArrayBytes,
		}).toString('hex');

		return fileHex;

	}

}

export default NodeFileEncryptor;

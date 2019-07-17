class PrivateStorage {

	/**
     *
     * @param {String} protectedPrivateKey
     * @param {String} protectedIV
     * @param {String} encryptedEncryptionHash
     */
	constructor(protectedPrivateKey, protectedIV, encryptedEncryptionHash) {
		this.protectedPrivateKey = protectedPrivateKey;
		this.protectedIV = protectedIV;
		this.encryptedEncryptionHash = encryptedEncryptionHash;
	}

}

export default PrivateStorage;

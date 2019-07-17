
class DB {

	/**
	 *
	 * @param {Object} header
	 * @param {String} encryptedData
	 */
	constructor(header, encryptedData) {
		this.header = header;
		this.encryptedData = encryptedData;
	}

	/**
	 *
	 * @param {String} encryptedData
	 */
	setEncryptedData(encryptedData) {
		this.encryptedData = encryptedData;
		return this;
	}

	/**
	 *
	 * @param {Object} header
	 * @param {Object} encryptedData
	 * @return {DB}
	 */
	static createDB(header, encryptedData) {
		return new DB(header, encryptedData);
	}

}

export default DB;

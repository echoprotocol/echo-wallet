
class ManualSchemeService {

	/**
	 *
	 * @param {StorageService} storageService
	 */
	constructor(storageService) {
		this.storageService = storageService;
	}

	/**
	 * @method getDecryptedData
	 * @param {Object} params
	 * @param {String} params.password
	 * @returns {Object}
	 */
	async getDecryptedData(params) {
		const decryptedData = await this.storageService.decryptDBByPassword(params.password);
		return JSON.parse(decryptedData.toString('utf8'));
	}
	/**
	 * @method updateDB
	 * @param {Object} db
	 * @param {Array} params
	 * @returns {undefined}
	 */
	async updateDB(db, params) {
		await this.storageService.updateDBByPassword(db, params.password);
	}

}

export default ManualSchemeService;

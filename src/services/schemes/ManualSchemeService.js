
class ManualSchemeService {

	/**
	 *
	 * @param {StorageService} storageService
	 */
	constructor(storageService) {
		this.storageService = storageService;
	}

	/**
	 *
	 * @param {Object} params
	 * @param {String} params.password
	 */
	async getDecryptedData(params) {
		const decryptedData = await this.storageService.decryptDBByPassword(params.password);
		return JSON.parse(decryptedData.toString('utf8'));
	}

	async updateDB(db, params) {
		await this.storageService.updateDBByPassword(db, params.password);
	}

}

export default ManualSchemeService;

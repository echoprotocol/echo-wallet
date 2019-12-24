import UserStorageService from './UserStorageService';
import MainProcessAPIService from './main.process.api.service';
import Blockchain from './Blockchain';
import Emitter from './Emitter';


class Services {

	constructor() {
		this.blockchain = null;
		this.userStorageService = null;
		this.mainProcessAPIService = null;
	}

	/**
	 * @method getEcho
	 * @returns {(null | Blockchain)}
	 */
	getEcho() {
		if (this.blockchain) {
			return this.blockchain;
		}

		this.blockchain = new Blockchain(this.getEmitter());

		return this.blockchain;
	}

	/**
	 * @method getUserStorage
	 * @returns {(null | UserStorageService)}
	 */
	getUserStorage() {

		if (this.userStorageService) {
			return this.userStorageService;
		}

		this.userStorageService = new UserStorageService();

		return this.userStorageService;
	}

	/**
	 * @method getEmitter
	 * @returns {(null | Emitter)}
	 */
	getEmitter() {

		if (this.emitter) {
			return this.emitter;
		}

		this.emitter = new Emitter();

		return this.emitter;
	}

	/**
	 * @method getMainProcessAPIService
	 * @returns {(null | MainProcessAPIService)}
	 */
	getMainProcessAPIService() {

		if (this.mainProcessAPIService) {
			return this.mainProcessAPIService;
		}

		this.mainProcessAPIService = new MainProcessAPIService();

		return this.mainProcessAPIService;
	}

}

export default new Services();

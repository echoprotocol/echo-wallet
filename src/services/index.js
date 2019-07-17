import UserStorageService from './UserStorageService';


class Services {

	constructor() {
		this.userStorageService = null;
	}


	getUserStorage() {

		if (this.userStorageService) {
			return this.userStorageService;
		}

		this.userStorageService = new UserStorageService();

		return this.userStorageService;
	}

}

export default new Services();

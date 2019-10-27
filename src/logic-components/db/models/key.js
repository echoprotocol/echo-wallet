import { isAccountId } from '../../../helpers/ValidateHelper';

class Key {

	/**
	 *
	 * @param {String} publicKey
	 * @param {String} wif
	 * @param {String} accountId
	 */
	constructor(publicKey, wif, accountId) {
		this.publicKey = publicKey;
		this.wif = wif;
		this.accountId = accountId;
	}

	/**
	 * @method create
	 * @param {String} publicKey
	 * @param {String} wif
	 * @param {String} accountId
	 * @return {Account}
	 */
	static create(publicKey, wif, accountId) {

		if (!publicKey) {
			throw new Error('publicKey is required.');
		}

		if (!wif) {
			throw new Error('WIF is required.');
		}

		if (!isAccountId(accountId)) {
			throw new Error('Account id is required.');
		}

		return new Key(publicKey, wif, accountId);

	}

}

export default Key;

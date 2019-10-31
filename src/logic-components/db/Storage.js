import { openDB } from 'idb';

class Storage {

	/**
	 *
	 * @param {String} dbName
	 * @param {String} store
	 */
	constructor(dbName, store) {
		this.dbName = dbName;
		this.store = store;
		this.db = null;
	}
	/**
	 * @method init
	 * @returns {undefined}
	 */
	async init() {
		const { store } = this;

		this.db = await openDB(this.dbName, 1, {
			upgrade(db) {
				db.createObjectStore(store);
			},
		});
	}

	/**
	 * @method getDB
	 */
	getDB() {
		return this.db;
	}

	/**
	 * @method get
	 * @param {String} key
	 * @return {Promise.<void>}
	 */
	async get(key) {
		return this.getDB().get(this.store, key);
	}

	/**
	 * @method set
	 * @param {String} key
	 * @param {Object} val
	 * @return {Promise.<*>}
	 */
	async set(key, val) {
		return this.getDB().put(this.store, val, key);
	}

	/**
	 * @method delete
	 * @param {String} key
	 * @return {Promise.<void>}
	 */
	async delete(key) {
		if (!this.getDB()) {
			return null;
		}

		return this.getDB().delete(this.store, key);
	}
	/**
	 * @method clear
	 * @return {Promise.<void>}
	 */
	async clear() {
		return this.getDB().clear(this.store);
	}

	/**
	 * @method keys
	 * @return {Promise.<void>}
	 */
	async keys() {
		return this.getDB().getAllKeys(this.store);
	}

}

export default Storage;

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

	async init() {
		const { store } = this;

		this.db = await openDB(this.dbName, 1, {
			upgrade(db) {
				db.createObjectStore(store);
			},
		});

		console.info('[DB] Inited');
	}

	getDB() {
		return this.db;
	}

	/**
	 *
	 * @param {String} key
	 * @return {Promise.<void>}
	 */
	async get(key) {
		return this.getDB().get(this.store, key);
	}

	/**
	 *
	 * @param {String} key
	 * @param {Object} val
	 * @return {Promise.<*>}
	 */
	async set(key, val) {
		return this.getDB().put(this.store, val, key);
	}

	/**
	 *
	 * @param {String} key
	 * @return {Promise.<void>}
	 */
	async delete(key) {
		if (!this.getDB()) {
			return null;
		}

		return this.getDB().delete(this.store, key);
	}

	async clear() {
		return this.getDB().clear(this.store);
	}

	async keys() {
		return this.getDB().getAllKeys(this.store);
	}

}

export default Storage;

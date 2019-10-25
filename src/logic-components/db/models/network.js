
class Network {

	/**
	 *
	 * @param {Array} keys
	 */
	constructor(keys) {
		this.keys = keys;
	}

	/**
	 * @method create
	 * @param {Array} keys
	 */
	static create(keys) {
		return new Network(keys);
	}

	/**
	 * @method addKey
	 * @param {Key} key
	 * @returns {Network}
	 */
	addKey(key) {
		this.keys.push(key);
		return this;
	}

	/**
	 * @method updateKeys
	 * @param {Key} keys
	 * @returns {Network}
	 */
	updateKeys(keys) {
		this.keys = keys;
		return this;
	}

	/**
	 * @method getAllKeys
	 * @return {Array}
	 */
	getAllKeys() {
		return this.keys;
	}

}

export default Network;

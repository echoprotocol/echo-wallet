
class Network {

	/**
	 *
	 * @param {Array} keys
	 */
	constructor(keys) {
		this.keys = keys;
	}

	/**
	 *
	 * @param {Array} keys
	 */
	static create(keys) {
		return new Network(keys);
	}

	/**
	 *
	 * @param {Key} key
	 * @returns {Network}
	 */
	addKey(key) {
		this.keys.push(key);
		return this;
	}

	/**
	 *
	 * @param {Key} keys
	 * @returns {Network}
	 */
	updateKeys(keys) {
		this.keys = keys;
		return this;
	}

	/**
	 *
	 * @return {Array}
	 */
	getAllKeys() {
		return this.keys;
	}

}

export default Network;

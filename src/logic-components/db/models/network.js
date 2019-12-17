
class Network {

	/**
	 *
	 * @param {Array} keys
	 */
	constructor(keys, chainToken = null) {
		this.keys = keys;
		this.chainToken = chainToken;
	}

	/**
	 * @method create
	 * @param {Array} keys
	 */
	static create(keys, chainToken = null) {
		return new Network(keys, chainToken);
	}

	/**
     * @method addKey
     * @param {Key} key
     * @returns {Network}
     */
	addKey(key) {
		if (!this.keys.find(({ wif, type }) => wif === key.wif && type === key.type)) {
			this.keys.push(key);
		}
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

	/**
	 * @method getChainToken
	 * @returns {object}
	 */
	getChainToken() {
		return this.chainToken;
	}

}

export default Network;

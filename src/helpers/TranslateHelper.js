class TranslateHelper {

	/**
     *  @method flattenMessages
     *
     * 	Converting from flat messages to nested.
     * 	React Intl v2 no longer supports nested messages objects
     *
     * 	@param {Object} nestedMessages
     * 	@param {String} prefix
     */
	static flattenMessages(nestedMessages, prefix = '') {
		return Object.keys(nestedMessages).reduce((messages, key) => {
			const value = nestedMessages[key];
			const prefixedKey = prefix ? `${prefix}.${key}` : key;

			if (typeof value === 'string') {
				messages[prefixedKey] = value;
			} else {
				Object.assign(messages, this.flattenMessages(value, prefixedKey));
			}

			return messages;
		}, {});
	}

}

export default TranslateHelper;

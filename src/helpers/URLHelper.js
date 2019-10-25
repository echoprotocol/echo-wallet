import { EXPLORER_URL } from '../constants/GlobalConstants';

class URLHelper {

	/**
	 * @method getLinkToExplorerBlock
	 * @param {Object} network
	 * @param {Object} block
	 * @returns @string
	 */
	static getLinkToExplorerBlock(network, block) {
		if (!EXPLORER_URL[network] || !block) {
			return undefined;
		}
		return `${EXPLORER_URL[network]}/blocks/${block}/1`;
	}

}
export default URLHelper;

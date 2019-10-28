import SortReducer from '../reducers/SortReducer';

/**
 * @method toggleSort
 *
 * @param {String} container
 * @param {String} sortType
 * @returns {function(dispatch, getState): undefined}
 */
export const toggleSort = (container, sortType) => (dispatch, getState) => {

	const sortInc = getState().sort.getIn([container, 'sortType']) === sortType ? !getState().sort.getIn([container, 'sortInc']) : true;

	dispatch(SortReducer.actions.set({ container, value: { sortType, sortInc } }));

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	let sorts = localStorage.getItem(`sorts_${networkName}`);
	sorts = sorts ? JSON.parse(sorts) : {};

	if (!sorts[accountId]) {
		sorts[accountId] = {};
	}

	sorts[accountId][container] = { sortType, sortInc };
	localStorage.setItem(`sorts_${networkName}`, JSON.stringify(sorts));
};

/**
 * @method initSorts
 *
 * @param {String} networkName
 * @returns {function(dispatch, getState): undefined}
 */
export const initSorts = (networkName) => (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (!accountId) return;

	let sorts = localStorage.getItem(`sorts_${networkName}`);
	sorts = sorts ? JSON.parse(sorts) : {};

	if (!sorts[accountId]) {
		sorts[accountId] = {};
	}

	Object.entries(sorts[accountId]).map(([container, value]) =>
		dispatch(SortReducer.actions.set({ container, value })));
};

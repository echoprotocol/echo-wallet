import SortReducer from '../reducers/SortReducer';

export const toggleSort = (container, sortType) => (dispatch, getState) => {

	const sortInc = getState().sort.getIn([container, 'sortType']) === sortType ? !getState().sort.getIn([container, 'sortInc']) : true;

	dispatch(SortReducer.actions.set({ container, value: { sortType, sortInc } }));

	const accountId = getState().global.getIn(['activeUser', 'id']);

	let sorts = localStorage.getItem('sorts');
	sorts = sorts ? JSON.parse(sorts) : {};

	if (!sorts[accountId]) {
		sorts[accountId] = {};
	}

	sorts[accountId][container] = { sortType, sortInc };
	localStorage.setItem('sorts', JSON.stringify(sorts));
};

export const initSorts = () => (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (!accountId) return;

	let sorts = localStorage.getItem('sorts');
	sorts = sorts ? JSON.parse(sorts) : {};

	if (!sorts[accountId]) {
		sorts[accountId] = {};
	}

	Object.entries(sorts[accountId]).map(([container, value]) => {
		dispatch(SortReducer.actions.set({ container, value }));
	});
};

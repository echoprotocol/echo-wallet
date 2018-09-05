import TableReducer from '../reducers/TableReducer';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

export const clearTable = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};

export const toggleLoading = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'loading', value }));
};

export const setError = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'error', value }));
};

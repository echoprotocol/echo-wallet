import TableReducer from '../reducers/TableReducer';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

export const clear = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};

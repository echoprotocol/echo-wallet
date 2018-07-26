import BuildTransactionReducer from '../reducers/BuildTransactionReducer';

export const setTransactionValue = (field, value) => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.set({ field, value }));
};

export const setInTransactionValue = (fields, value) => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.setIn({ fields, value }));
};
export const resetTransactionValues = () => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.reset());
};

import BuildTransactionReducer from '../reducers/BuildTransactionReducer';

export const setValue = (field, value) => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.set({ field, value }));
};

export const setTransaction = (value) => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.set({ value }));
};
export const reset = () => (dispatch) => {
	dispatch(BuildTransactionReducer.actions.reset());
};

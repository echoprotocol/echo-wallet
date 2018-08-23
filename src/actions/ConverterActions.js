import ConverterReducer from '../reducers/ConverterReducer';

export const resetConverter = () => (dispatch) => {
	dispatch(ConverterReducer.actions.reset());
};

export const set = (field, value) => (dispatch) => {
	dispatch(ConverterReducer.actions.set({ field, value }));
};

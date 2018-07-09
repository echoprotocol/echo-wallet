import GlobalReducer from '../reducers/GlobalReducer';

export const set = (field, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field, value }));
};

export const setValue = (params) => (dispatch) => {
	dispatch(GlobalReducer.actions.setTitleTest({ params }));
};

export const setSomeParams = (parames) => (dispatch) => {
	dispatch(GlobalReducer.actions.setTitleTest({ parames }));
};

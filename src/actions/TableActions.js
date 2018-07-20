import formatOperation from '../helpers/OperationsHistoryHelper';
import TableReducer from '../reducers/TableReducer';

export const setValue = (form, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ form, field, value }));
};

export const setBodyTable = (history) => async (dispatch) => {
	const operations = await Promise.all(history.map((h) => formatOperation(h)));
	dispatch(setValue('activityBodyTable', 'history', operations));
};

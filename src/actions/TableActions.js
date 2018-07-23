import { formatOperation } from '../helpers/OperationsHistoryHelper';
import TableReducer from '../reducers/TableReducer';
import { HISTORY_DATA } from '../constants/TableConstants';

export const setValue = (form, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ form, field, value }));
};

export const formatHistory = (history) => async (dispatch) => {
	const operations = await Promise.all(history.map((h) => formatOperation(h)));
	dispatch(setValue(HISTORY_DATA, 'history', operations));
};

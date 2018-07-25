import { formatOperation } from '../helpers/HistoryHelper';
import TableReducer from '../reducers/TableReducer';
import HISTORY_DATA from '../constants/TableConstants';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

export const formatHistory = (history) => async (dispatch) => {
	const operations = await Promise.all(history.toJS().map((h) => formatOperation(h)));
	dispatch(setValue(HISTORY_DATA, 'history', operations));
};

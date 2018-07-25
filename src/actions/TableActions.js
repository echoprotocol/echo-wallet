import transformHistory from './HistoryActions';
import TableReducer from '../reducers/TableReducer';
import HISTORY_DATA from '../constants/TableConstants';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

export const formatHistory = (history) => async (dispatch) => {
	const operations = await Promise.all(dispatch(transformHistory(history)));
	dispatch(setValue(HISTORY_DATA, 'history', operations));
};

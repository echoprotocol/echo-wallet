import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES } from '../constants/RouterConstants';
import { HISTORY_DATA } from '../constants/TableConstants';

import { initBalances, getObject, resetBalance } from '../actions/BalanceActions';
import { loadContracts } from '../actions/ContractActions';
import { clear } from '../actions/TableActions';

export const initAccount = (accountName) => async (dispatch) => {
	localStorage.setItem('current_account', accountName);

	const { id, name } = (await dispatch(EchoJSActions.fetch(accountName))).toJS();

	dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));

	if (AUTH_ROUTES.includes(history.location.pathname)) {
		history.push(INDEX_PATH);
	}

	await dispatch(initBalances(id));
	dispatch(loadContracts(id));
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		await dispatch(EchoJSActions.connect(undefined, { types: ['objects', 'block'], method: getObject }));
		const accountName = localStorage.getItem('current_account');

		if (!accountName) {
			if (!AUTH_ROUTES.includes(history.location.pathname)) {
				history.push(SIGN_IN_PATH);
			}
		} else {
			await dispatch(initAccount(accountName));
		}

	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: err }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};

export const toggleBar = (value) => (dispatch) => {
	dispatch(GlobalReducer.actions.toggleBar({ value }));
};

export const hideBar = () => (dispatch) => {
	dispatch(GlobalReducer.actions.hideBar());
};

export const push = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.push({ field, param, value }));
};

export const update = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.update({ field, param, value }));
};

export const remove = (field, param) => (dispatch) => {
	dispatch(GlobalReducer.actions.remove({ field, param }));
};

export const logout = () => (dispatch) => {
	localStorage.removeItem('current_account');
	dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id: '', name: '' } }));
	dispatch(clear(HISTORY_DATA));
	dispatch(resetBalance());
	history.push(SIGN_IN_PATH);
};

import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES, SIGN_UP_PATH } from '../constants/RouterConstants';
import { HISTORY_DATA } from '../constants/TableConstants';

import {
	initBalances,
	getObject,
	resetBalance,
	initAccountsBalances,
} from '../actions/BalanceActions';
import { initSorts } from '../actions/SortActions';
import { loadContracts } from '../actions/ContractActions';
import { clear } from '../actions/TableActions';

export const initAccount = (accountName) => async (dispatch) => {
	localStorage.setItem('current_account', accountName);

	const { id, name } = (await dispatch(EchoJSActions.fetch(accountName))).toJS();

	let accounts = localStorage.getItem('accounts');

	accounts = accounts ? JSON.parse(accounts) : [];

	if (!accounts.find((account) => account.name === accountName)) {
		accounts.push({ id, name: accountName });
		localStorage.setItem('accounts', JSON.stringify(accounts));
	}

	dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));

	if (AUTH_ROUTES.includes(history.location.pathname)) {
		history.push(INDEX_PATH);
	}

	await dispatch(initBalances(id));
	await dispatch(initAccountsBalances(accounts));
	dispatch(initSorts());
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
			if (process.env.NODE_ENV !== 'development') history.push(INDEX_PATH);
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
	localStorage.removeItem('accounts');
	dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id: '', name: '' } }));
	dispatch(clear(HISTORY_DATA));
	dispatch(resetBalance());
	history.push(SIGN_IN_PATH);
};

export const addAccount = () => (dispatch) => {
	dispatch(clear(HISTORY_DATA));
	dispatch(resetBalance());

	dispatch(GlobalReducer.actions.set({ field: 'isAddAccount', value: true }));

	history.push(SIGN_UP_PATH);
};

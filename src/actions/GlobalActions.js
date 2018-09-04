import { EchoJSActions } from 'echojs-redux';
import { List } from 'immutable';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES, SIGN_UP_PATH } from '../constants/RouterConstants';
import { HISTORY_DATA } from '../constants/TableConstants';

import {
	initBalances,
	getObject,
	resetBalance,
} from '../actions/BalanceActions';
import { initSorts } from '../actions/SortActions';
import { loadContracts } from '../actions/ContractActions';
import { clear } from '../actions/TableActions';

export const initAccount = (accountName) => async (dispatch) => {
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

	dispatch(initSorts());
	dispatch(loadContracts(id));
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		await dispatch(EchoJSActions.connect(undefined, { types: ['objects', 'block'], method: getObject }));
		const accounts = localStorage.getItem('accounts');

		const accountName = accounts ? JSON.parse(accounts).slice(-1)[0].name : null;

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

export const initAccountsBalances = () => async (dispatch) => {
	let accounts = localStorage.getItem('accounts');

	accounts = accounts ? JSON.parse(accounts) : [];

	let accountsBalances = accounts.map(async (account) => {
		const accountData = (await dispatch(EchoJSActions.fetch(account.id))).toJS();
		let stats = null;
		if (accountData.balances) {
			stats = (await dispatch(EchoJSActions.fetch(accountData.balances['1.3.0']))).toJS();
		}
		return { name: account.name, balance: stats ? stats.balance : null };
	});

	accountsBalances = await Promise.all(accountsBalances);

	dispatch(GlobalReducer.actions.set({
		field: 'accounts',
		value: new List(accountsBalances),
	}));
};

export const logout = () => async (dispatch, getState) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));
	const accountName = getState().global.getIn(['activeUser', 'name']);
	let accounts = localStorage.getItem('accounts');
	try {
		accounts = JSON.parse(accounts);
	} catch (e) {
		accounts = [];
	}

	const currAccountIndex = accounts.findIndex((account) => account.name === accountName);

	if (currAccountIndex !== -1) {
		accounts.splice(currAccountIndex, 1);
		localStorage.setItem('accounts', JSON.stringify(accounts));
		dispatch(initAccountsBalances());
	}

	if (accounts.length) {
		await dispatch(initAccount(accounts[0].name));
	} else {
		localStorage.removeItem('accounts');
		dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id: '', name: '' } }));
		dispatch(clear(HISTORY_DATA));
		dispatch(resetBalance());
		history.push(SIGN_IN_PATH);
	}
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
};

export const addAccount = () => (dispatch) => {
	dispatch(clear(HISTORY_DATA));
	dispatch(resetBalance());

	dispatch(GlobalReducer.actions.set({ field: 'isAddAccount', value: true }));

	history.push(SIGN_UP_PATH);
};

import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import { PERMISSION_TABLE } from '../constants/TableConstants';

import TableReducer from '../reducers/TableReducer';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

export const clearTable = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};

export const toggleLoading = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'loading', value }));
};

export const setError = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'error', value }));
};

export const setIn = (table, fields, value) => (dispatch) => {
	dispatch(TableReducer.actions.setIn({ table, fields, value }));
};

export const update = (table, fields, param, value) => (dispatch) => {
	dispatch(TableReducer.actions.update({
		table, fields, param, value,
	}));
};

export const clear = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};


export const formPermissionKeys = () => async (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (!accountId) return;

	const account = getState().echojs.getIn(['data', 'accounts', accountId]).toJS();

	// save active accounts
	let target = account.active.account_auths.map(async (a) => {
		const { name } = (await dispatch(EchoJSActions.fetch(a[0]))).toJS();
		return {
			key: name, weight: a[1], role: 'active', type: 'accounts',
		};
	});
	dispatch(setIn(PERMISSION_TABLE, ['active', 'accounts'], new List(await Promise.all(target))));

	// save active keys
	target = account.active.key_auths.map((a) => ({
		key: a[0], weight: a[1], role: 'active', type: 'keys',
	}));
	dispatch(setIn(PERMISSION_TABLE, ['active', 'keys'], new List(target)));

	// save owner accounts
	target = account.owner.account_auths.map(async (a) => {
		const { name } = (await dispatch(EchoJSActions.fetch(a[0]))).toJS();
		return {
			key: name, weight: a[1], role: 'owner', type: 'accounts',
		};
	});
	dispatch(setIn(PERMISSION_TABLE, ['owner', 'accounts'], new List(await Promise.all(target))));

	// save owner keys
	target = account.owner.key_auths.map((a) => ({
		key: a[0], weight: a[1], role: 'owner', type: 'keys',
	}));
	dispatch(setIn(PERMISSION_TABLE, ['owner', 'keys'], new List(target)));

	// save note
	target = {
		key: account.options.memo_key, role: 'memo', type: 'keys',
	};
	dispatch(setIn(PERMISSION_TABLE, ['memo', 'keys'], new List([target])));
};

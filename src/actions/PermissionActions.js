import { List } from 'immutable';

import PermissionReducer from '../reducers/PermissionReducer';

export const set = (field, value) => (dispatch) => {
	dispatch(PermissionReducer.actions.set({ field, value }));
};

export const setIn = (fields, value) => (dispatch) => {
	// if (typeof value === 'object') value = new Map(value);
	dispatch(PermissionReducer.actions.setIn({ fields, value }));
};

export const clear = () => (dispatch) => {
	dispatch(PermissionReducer.actions.clear());
};

export const update = (fields, param, value) => (dispatch) => {
	dispatch(PermissionReducer.actions.update({ fields, param, value }));
};

export const formPermissionKeys = () => (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const account = getState().echojs.getIn(['data', 'accounts', accountId]).toJS();

	// save active accounts
	let target = account.active.account_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey: '',
	}));
	dispatch(setIn(['active', 'accounts'], new List(target)));

	// save active keys
	target = account.active.key_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey: '',
	}));
	dispatch(setIn(['active', 'keys'], new List(target)));

	// save owner accounts
	target = account.owner.account_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey: '',
	}));
	dispatch(setIn(['owner', 'accounts'], new List(target)));

	// save owner keys
	target = account.owner.key_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey: '',
	}));
	dispatch(setIn(['owner', 'keys'], new List(target)));

	// save note
	target = { key: account.options.memo_key, unlocked: false, privateKey: '' };
	dispatch(setIn(['note', 'keys'], new List([target])));
};

export const unlockPrivateKey = () => () => {

}


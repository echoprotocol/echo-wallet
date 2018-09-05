import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import { openModal } from '../actions/ModalActions';

import { PERMISSION_TABLE } from '../constants/TableConstants';
import { MODAL_UNLOCK } from '../constants/ModalConstants';

import TableReducer from '../reducers/TableReducer';

const zeroPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';

export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
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
	const account = getState().echojs.getIn(['data', 'accounts', accountId]).toJS();
	const privateKey = zeroPrivateKey;

	// save active accounts
	let target = account.active.account_auths.map(async (a) => {
		const { name } = (await dispatch(EchoJSActions.fetch(a[0]))).toJS();
		return {
			key: name, weight: a[1], unlocked: false, privateKey, role: 'active', type: 'accounts',
		};
	});
	dispatch(setIn(PERMISSION_TABLE, ['active', 'accounts'], new List(await Promise.all(target))));

	// save active keys
	target = account.active.key_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey, role: 'active', type: 'keys',
	}));
	dispatch(setIn(PERMISSION_TABLE, ['active', 'keys'], new List(target)));

	// save owner accounts
	target = account.owner.account_auths.map(async (a) => {
		const { name } = (await dispatch(EchoJSActions.fetch(a[0]))).toJS();
		return {
			key: name, weight: a[1], unlocked: false, privateKey, role: 'owner', type: 'accounts',
		};
	});
	dispatch(setIn(PERMISSION_TABLE, ['owner', 'accounts'], new List(await Promise.all(target))));

	// save owner keys
	target = account.owner.key_auths.map((a) => ({
		key: a[0], weight: a[1], unlocked: false, privateKey, role: 'owner', type: 'keys',
	}));
	dispatch(setIn(PERMISSION_TABLE, ['owner', 'keys'], new List(target)));

	// save note
	target = {
		key: account.options.memo_key, unlocked: false, privateKey, role: 'memo', type: 'keys',
	};
	dispatch(setIn(PERMISSION_TABLE, ['memo', 'keys'], new List([target])));
};

export const unlockPrivateKey = (k) => (dispatch) => {
	const {
		key, unlocked, role, type,
	} = k;
	if (unlocked) {
		const value = { unlocked: false, privateKey: zeroPrivateKey };
		dispatch(update(PERMISSION_TABLE, [role, type], key, value));
		return;
	}

	dispatch(setIn(PERMISSION_TABLE, ['permissionKey'], { key, type, role }));

	dispatch(openModal(MODAL_UNLOCK));
};


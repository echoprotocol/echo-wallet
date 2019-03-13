import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import { PERMISSION_TABLE } from '../constants/TableConstants';
import { MODAL_UNLOCK } from '../constants/ModalConstants';

import TableReducer from '../reducers/TableReducer';
import { getFeeSync, resetTransaction } from './TransactionActions';
import TransactionReducer from '../reducers/TransactionReducer';
import { openModal } from './ModalActions';
import { FORM_PERMISSION_KEY } from '../constants/FormConstants';
import { isThreshold, isPublicKey } from '../helpers/ValidateHelper';
import { setInFormError } from './FormActions';

const zeroPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';

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

	let threshold = account.active.weight_threshold;
	dispatch(setIn(PERMISSION_TABLE, ['active', 'threshold'], threshold));

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

	threshold = account.owner.weight_threshold;
	dispatch(setIn(PERMISSION_TABLE, ['owner', 'threshold'], threshold));

	// save note
	target = {
		key: account.options.memo_key, role: 'memo', type: 'keys',
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

export const isChanged = () => (dispatch, getState) => {
	const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
	const permissionTable = getState().table.get(PERMISSION_TABLE);

	const roles = ['active', 'owner', 'memo'];

	return roles.some((role) => permissionForm.getIn([role, 'keys']).some((keyForm) => {
		const threshold = permissionForm.getIn([role, 'threshold']);

		if (!permissionTable.getIn([role, 'threshold']) || !threshold.value) {
			return false;
		}

		if (threshold && permissionTable.getIn([role, 'threshold']).toString() !== threshold.value.toString()) {
			return true;
		}

		if (!keyForm.get('key') || !keyForm.get('weight')) {
			return false;
		}

		if (!keyForm.get('key').value || !keyForm.get('weight').value) {
			return false;
		}

		if (keyForm.get('remove')) {
			return true;
		}

		let tableAccountsKeys = permissionTable.getIn([role, 'keys']);

		if (role !== 'memo') {
			tableAccountsKeys = tableAccountsKeys.concat(permissionTable.getIn([role, 'accounts']));
		}

		return !tableAccountsKeys
			.some((keyTable) => keyTable.key === keyForm.get('key').value && keyTable.weight.toString() === keyForm.get('weight').value.toString());
	}));
};

export const permissionTransaction = () => async (dispatch, getState) => {
	const currentAccount = getState().global.get('activeUser');
	const currentOptions = getState().echojs.getIn(['data', 'accounts', currentAccount.get('id'), 'options']);
	const currentFullAccount = getState().echojs.getIn(['data', 'accounts', currentAccount.get('id')]);
	const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
	const permissionTable = getState().table.get(PERMISSION_TABLE);

	const roles = ['active', 'owner', 'memo'];

	const isError = ['active', 'owner'].some((role) => {
		const threshold = permissionForm.getIn([role, 'threshold']).value;

		if (!isThreshold(threshold)) {
			dispatch(setInFormError(FORM_PERMISSION_KEY, [role, 'threshold'], 'Invalide threshold'));
			return true;
		}

		return false;
	});

	if (isError) {
		return false;
	}

	const permissionData = {
		active: {
			keys: [],
			accounts: [],
			threshold: null,
		},
		owner: {
			keys: [],
			accounts: [],
			threshold: null,
		},
		memo: {
			keys: [],
			accounts: [],
			threshold: null,
		},
	};

	const rolesPromises = [];

	roles.forEach((role) => {
		const accountsPromises = [];

		permissionForm.getIn([role, 'keys']).some((keyForm) => {
			const threshold = permissionForm.getIn([role, 'threshold']);

			if (threshold && permissionTable.getIn([role, 'threshold']) !== threshold.value) {
				permissionData[role].threshold = Number(threshold.value);
			}

			if (
				!permissionTable
					.getIn([role, 'keys'])
					.some((keyTable) => keyTable.key === keyForm.get('key').value && keyTable.weight === keyForm.get('weight').value)
				|| keyForm.get('remove')
			) {
				permissionForm.getIn([role, 'keys']).forEach((value) => {
					const weightInt = parseInt(value.get('weight').value, 10);

					if (value.get('remove') || !value.get('key').value || !weightInt) {
						return;
					}

					if (isPublicKey(value.get('key').value)) {
						permissionData[role].keys.push([value.get('key').value, weightInt]);
					} else {
						accountsPromises.push(dispatch(EchoJSActions.fetch(value.get('key').value)));
						permissionData[role].accounts.push([value.get('key').value, weightInt]);
					}
				});

				return true;
			}

			return false;
		});

		rolesPromises.push(Promise.all(accountsPromises));
	});

	const accountsResults = await Promise.all(rolesPromises);

	['active', 'owner'].forEach((role, index) => {
		accountsResults[index].forEach((account, i) => {
			permissionData[role].accounts[i][0] = account.get('id');
		});
	});

	if (
		!permissionData.active.keys.length
			&& !permissionData.owner.keys.length
			&& !permissionData.memo.keys.length
			&& permissionData.active.threshold !== null
			&& permissionData.owner.threshold !== null
	) {
		return false;
	}

	await dispatch(EchoJSActions.fetch('2.0.0'));
	await dispatch(EchoJSActions.fetch('1.3.0'));

	const fee = dispatch(getFeeSync('account_update'));

	const transaction = {
		fee: {
			amount: fee.value,
			asset_id: fee.asset.id,
		},
		account: currentAccount.get('id'),
	};

	const showOptions = {
		account: currentAccount.get('name'),
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
	};

	if (permissionData.active.keys.length || permissionData.active.threshold) {
		const keysMap = [];

		permissionForm.getIn(['active', 'keys']).forEach((value) => {
			keysMap.push([value.get('key').value, parseInt(value.get('weight').value, 10)]);
		});

		transaction.active = {
			weight_threshold: currentFullAccount.getIn(['active', 'weight_threshold']),
			account_auths: currentFullAccount.getIn(['active', 'account_auths']),
			key_auths: keysMap,
			address_auths: [],
		};

		if (permissionData.active.keys.length) {
			showOptions.activeThreshold = transaction.active.weight_threshold;
			showOptions.active = permissionData.active.keys;

			transaction.active.key_auths = permissionData.active.keys;
		}

		if (permissionData.active.accounts.length) {
			showOptions.activeAccounts = permissionData.active.accounts;
			transaction.active.account_auths = permissionData.active.accounts;
		}

		if (permissionData.active.threshold) {
			showOptions.activeThreshold = permissionData.active.threshold;
			showOptions.active = transaction.active.key_auths;
			showOptions.activeAccounts = transaction.active.account_auths;

			transaction.active.weight_threshold = permissionData.active.threshold;
		}
	}

	if (permissionData.owner.keys.length || permissionData.owner.threshold) {
		const keysMap = [];

		permissionForm.getIn(['owner', 'keys']).forEach((value) => {
			keysMap.push([value.get('key').value, parseInt(value.get('weight').value, 10)]);
		});

		transaction.owner = {
			weight_threshold: currentFullAccount.getIn(['owner', 'weight_threshold']),
			account_auths: currentFullAccount.getIn(['owner', 'account_auths']),
			key_auths: keysMap,
			address_auths: [],
		};

		if (permissionData.owner.keys.length) {
			showOptions.ownerThreshold = transaction.owner.weight_threshold;
			showOptions.owner = permissionData.owner.keys;

			transaction.owner.key_auths = permissionData.owner.keys;
		}

		if (permissionData.owner.accounts.length) {
			showOptions.ownerAccounts = permissionData.owner.accounts;
			transaction.owner.account_auths = permissionData.owner.accounts;
		}

		if (permissionData.owner.threshold) {
			showOptions.ownerThreshold = permissionData.owner.threshold;
			showOptions.owner = transaction.owner.key_auths;
			showOptions.ownerAccounts = transaction.owner.account_auths;

			transaction.owner.weight_threshold = permissionData.owner.threshold;
		}
	}

	if (permissionData.memo.keys.length) {
		[[showOptions.memo]] = permissionData.memo.keys;
		transaction.new_options = {
			memo_key: permissionData.memo.keys[0][0],
			voting_account: currentOptions.get('voting_account'),
			delegating_account: currentOptions.get('delegating_account'),
			num_committee: currentOptions.get('num_committee'),
			num_witness: currentOptions.get('num_witness'),
			votes: [],
			extensions: [],
		};
	}

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: 'account_update',
		options: transaction,
		showOptions,
	}));

	return true;
};

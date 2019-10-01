import { List } from 'immutable';
import echo, { CACHE_MAPS } from 'echojs-lib';

import { PERMISSION_TABLE } from '../constants/TableConstants';

import TableReducer from '../reducers/TableReducer';
import { resetTransaction } from './TransactionActions';
import TransactionReducer from '../reducers/TransactionReducer';
import { openModal } from './ModalActions';
import { FORM_PERMISSION_KEY } from '../constants/FormConstants';
import { isThreshold, isPublicKey, isAccountId, isWeight } from '../helpers/ValidateHelper';
import { setInFormError, setInFormValue, setValue as setFormValue } from './FormActions';
import { MODAL_UNLOCK } from '../constants/ModalConstants';
import { getOperationFee } from '../api/TransactionApi';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

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

	const account = getState().echojs.getIn([CACHE_MAPS.ACCOUNTS_BY_ID, accountId]).toJS();

	// save active accounts
	let target = account.active.account_auths.map(async (a) => {

		const { name } = await echo.api.getObject(a[0]);
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

	const threshold = account.active.weight_threshold;
	dispatch(setIn(PERMISSION_TABLE, ['active', 'threshold'], threshold));

	dispatch(setFormValue(FORM_PERMISSION_KEY, 'firstFetch', true));
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

	const roles = ['active'];

	return roles.some((role) => permissionForm.getIn([role, 'keys']).some((keyForm) => {
		let tableAccountsKeys = permissionTable.getIn([role, 'keys']);

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

		tableAccountsKeys = tableAccountsKeys.concat(permissionTable.getIn([role, 'accounts']));

		return !tableAccountsKeys
			.some((keyTable) => keyTable.key === keyForm.get('key').value && keyTable.weight.toString() === keyForm.get('weight').value.toString());
	}));
};

export const validateKey = (role, tableKey, key, weight) => async (dispatch) => {
	let error = false;

	if (!key) {
		dispatch(setInFormValue(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'key'], ''));
	}

	let account = null;

	if (!key) {
		error = true;
		dispatch(setInFormError(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'key'], 'Incorrect key'));
	} else {
		try {

			if (!isPublicKey(key.value, 'ECHO')) {
				if (isAccountId(key.value)) {
					account = await echo.api.getObject(key.value);
				} else {
					account = await echo.api.getAccountByName(key.value);
				}

				if (!account) {
					error = true;
					dispatch(setInFormError(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'key'], 'Incorrect account'));
				}
			}

		} catch (e) {
			error = true;
			dispatch(setInFormError(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'key'], 'Incorrect key'));
		}

	}

	if (!weight) {
		dispatch(setInFormValue(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'weight'], ''));
	}

	if (!weight || !isWeight(weight.value)) {
		error = true;

		dispatch(setInFormError(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'weight'], 'Incorrect weight'));
	}

	if (!error && account) {
		dispatch(setInFormValue(FORM_PERMISSION_KEY, [role, 'keys', tableKey, 'key'], account.name));
	}

	return error;
};

export const permissionTransaction = () => async (dispatch, getState) => {
	const currentAccount = getState().global.get('activeUser');
	const currentFullAccount = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, currentAccount.get('id')]);
	const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
	const permissionTable = getState().table.get(PERMISSION_TABLE);

	const roles = ['active'];

	const validateFields = [];
	roles.forEach((role) => {
		permissionForm.getIn([role, 'keys']).mapEntries(([keyTable, keyForm]) => {
			validateFields.push(dispatch(validateKey(role, keyTable, keyForm.get('key'), keyForm.get('weight'))));
		});
	});
	const errors = await Promise.all(validateFields);

	if (errors.includes(true)) {
		return false;
	}

	const isError = ['active'].some((role) => {
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
						// TODO: check result
						accountsPromises.push(echo.api.getAccountByName(value.get('key').value));
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

	['active'].forEach((role, index) => {
		accountsResults[index].forEach((account, i) => {
			permissionData[role].accounts[i][0] = account.id;
		});
	});

	if (
		!permissionData.active.keys.length
		&& permissionData.active.threshold === null
	) {
		return false;
	}

	await echo.api.getGlobalProperties(true);
	const feeAsset = await echo.api.getObject(ECHO_ASSET_ID);

	const transaction = {
		account: currentAccount.get('id'),
	};

	const showOptions = {
		account: currentAccount.get('name'),
	};

	if (
		permissionData.active.keys.length
		|| permissionData.active.accounts.length
		|| permissionData.active.threshold
	) {
		const keysMap = [];

		permissionForm.getIn(['active', 'keys']).forEach((value) => {
			if (!isPublicKey(value.get('key').value)) {
				return;
			}

			keysMap.push([value.get('key').value, parseInt(value.get('weight').value, 10)]);
		});

		transaction.active = {
			weight_threshold: currentFullAccount.getIn(['active', 'weight_threshold']),
			account_auths: currentFullAccount.getIn(['active', 'account_auths']).toJS(),
			key_auths: keysMap,
			address_auths: [],
		};

		if (permissionData.active.threshold) {
			showOptions.activeThreshold = permissionData.active.threshold;

			transaction.active.weight_threshold = permissionData.active.threshold;
		} else {
			showOptions.activeThreshold = transaction.active.weight_threshold;
		}

		if (permissionData.active.keys.length) {
			showOptions.activeKeys = permissionData.active.keys;

			transaction.active.key_auths = permissionData.active.keys;
		} else if (transaction.active.key_auths.length) {
			showOptions.activeKeys = transaction.active.key_auths;
		}

		if (permissionData.active.accounts.length) {
			showOptions.activeAccounts = permissionData.active.accounts;

			transaction.active.account_auths = permissionData.active.accounts;
		} else if (transaction.active.account_auths.length) {
			showOptions.activeAccounts = transaction.active.account_auths;
		}
	}

	const feeValue = await getOperationFee('account_update', transaction);

	transaction.fee = {
		amount: feeValue,
		asset_id: ECHO_ASSET_ID,
	};

	showOptions.fee = `${feeValue / (10 ** feeAsset.precision)} ${feeAsset.symbol}`;

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: 'account_update',
		options: transaction,
		showOptions,
	}));

	return true;
};

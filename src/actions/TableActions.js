import { List } from 'immutable';
import echo, { CACHE_MAPS } from 'echojs-lib';

import { PERMISSION_TABLE } from '../constants/TableConstants';

import TableReducer from '../reducers/TableReducer';
import { resetTransaction } from './TransactionActions';
import TransactionReducer from '../reducers/TransactionReducer';
import { openModal } from './ModalActions';
import { FORM_PERMISSION_KEY } from '../constants/FormConstants';
import { isThreshold, isPublicKey, isWeight } from '../helpers/ValidateHelper';
import { setInFormError, setInFormValue, setValue as setFormValue } from './FormActions';
import { MODAL_UNLOCK } from '../constants/ModalConstants';
import { getOperationFee } from '../api/TransactionApi';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

const zeroPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * @method setValue
 *
 * @param {String} table
 * @param {String} field
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const setValue = (table, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field, value }));
};

/**
 * @method clearTable
 *
 * @param {String} table
 * @returns {function(dispatch): undefined}
 */
export const clearTable = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};

/**
 * @method toggleLoading
 *
 * @param {String} table
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const toggleLoading = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'loading', value }));
};

/**
 * @method setError
 *
 * @param {String} table
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const setError = (table, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ table, field: 'error', value }));
};

/**
 * @method setIn
 *
 * @param {String} table
 * @param {String} fields
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const setIn = (table, fields, value) => (dispatch) => {
	dispatch(TableReducer.actions.setIn({ table, fields, value }));
};

/**
 * @method update
 *
 * @param {String} table
 * @param {String} fields
 * @param {String} param
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const update = (table, fields, param, value) => (dispatch) => {
	dispatch(TableReducer.actions.update({
		table, fields, param, value,
	}));
};

/**
 * @method clear
 *
 * @param {String} table
 * @returns {function(dispatch): undefined}
 */
export const clear = (table) => (dispatch) => {
	dispatch(TableReducer.actions.clear({ table }));
};

/**
 * @method formPermissionKeys
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const formPermissionKeys = () => async (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	if (!accountId) return;

	const [account] = await echo.api.getFullAccounts([accountId]);

	let accounts = localStorage.getItem(`accounts_${networkName}`);

	accounts = accounts ? JSON.parse(accounts) : [];

	const storageAccount = accounts.find(({ name }) => name === account.name);
	const storageSavedWifStatuses = (storageAccount && storageAccount.addedKeys)
		? storageAccount.addedKeys : {};
	// save active accounts
	let target = account.active.account_auths.map(async (a) => {

		const { name } = await echo.api.getObject(a[0]);
		return {
			key: name, weight: a[1], role: 'active', type: 'accounts', hasWif: false,
		};
	});
	dispatch(setIn(PERMISSION_TABLE, ['active', 'accounts'], new List(await Promise.all(target))));

	// save active keys
	target = account.active.key_auths.map((a) => ({
		key: a[0], weight: a[1], role: 'active', type: 'keys', hasWif: !!storageSavedWifStatuses[a[0]],
	}));

	dispatch(setIn(PERMISSION_TABLE, ['active', 'keys'], new List(target)));

	target = [{
		key: account.echorand_key,
		role: 'echoRand',
		type: 'keys',
		hasWif: !!storageSavedWifStatuses[account.echorand_key],
	}];

	dispatch(setIn(PERMISSION_TABLE, ['echoRand', 'keys'], new List(target)));

	const threshold = account.active.weight_threshold;
	dispatch(setIn(PERMISSION_TABLE, ['active', 'threshold'], threshold));

	dispatch(setFormValue(FORM_PERMISSION_KEY, 'firstFetch', true));
};

/**
 * @method unlockPrivateKey
 *
 * @param {String} k
 * @returns {function(dispatch): undefined}
 */
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

/**
 * @method isChanged
 * @@returns {function(dispatch, getState): Boolean}
 */
export const isChanged = () => (dispatch, getState) => {
	const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
	const permissionTable = getState().table.get(PERMISSION_TABLE);

	const roles = ['active', 'echoRand'];

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

/**
 * @param {Object} privateKeys
 * @returns {Object}
 */
export const validatePrivateKeys = (privateKeys) =>
	Object.values(privateKeys.active).some((wif) => wif && !!wif.error)
		|| Object.values(privateKeys.echoRand).some((wif) => wif && !!wif.error);

/**
 * @method validateKey
 *
 * @param {String} role
 * @param {String} tableKey
 * @param {Object} key
 * @param {Object} weight
 * @returns {function(dispatch): Promise<Boolean>}
 */
export const validateKey = (role, tableKey, type, key, weight) => async (dispatch) => {
	let error = false;

	if (!key) {
		dispatch(setInFormValue(FORM_PERMISSION_KEY, [role, type, tableKey, 'key'], ''));
	}

	let account = null;

	if (!key) {
		error = true;
		dispatch(setInFormError(FORM_PERMISSION_KEY, [role, type, tableKey, 'key'], 'Incorrect key'));
	} else if (type === 'keys') {
		if (!isPublicKey(key.value, 'ECHO')) {
			dispatch(setInFormError(FORM_PERMISSION_KEY, [role, type, tableKey, 'key'], 'Incorrect key'));
		}
	} else {
		try {
			account = await echo.api.getAccountByName(key.value);

			if (!account) {
				error = true;
				dispatch(setInFormError(FORM_PERMISSION_KEY, [role, type, tableKey, 'key'], 'Incorrect account'));
			}
		} catch (e) {
			error = true;
			dispatch(setInFormError(FORM_PERMISSION_KEY, [role, type, tableKey, 'key'], 'Incorrect account'));
		}
	}

	if (!weight && role === 'active') {
		dispatch(setInFormValue(FORM_PERMISSION_KEY, [role, type, tableKey, 'weight'], ''));
	}

	if ((!weight || !isWeight(weight.value)) && role === 'active') {
		error = true;

		dispatch(setInFormError(FORM_PERMISSION_KEY, [role, type, tableKey, 'weight'], 'Incorrect weight'));
	}

	return error;
};

/**
 * @method permissionTransaction
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const permissionTransaction = (privateKeys) => async (dispatch, getState) => {
	const currentAccount = getState().global.get('activeUser');
	const currentFullAccount = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, currentAccount.get('id')]);
	const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
	const permissionTable = getState().table.get(PERMISSION_TABLE);

	const roles = ['active', 'echoRand'];

	const validateFields = [];
	roles.forEach((role) => {
		permissionForm.getIn([role, 'keys']).mapEntries(([keyTable, keyForm]) => {
			validateFields.push(dispatch(validateKey(role, keyTable, 'keys', keyForm.get('key'), keyForm.get('weight'))));
		});
	});

	if (permissionForm.getIn(['active', 'accounts'])) {
		permissionForm.getIn(['active', 'accounts']).mapEntries(([keyTable, keyForm]) => {
			validateFields.push(dispatch(validateKey('active', keyTable, 'accounts', keyForm.get('key'), keyForm.get('weight'))));
		});
	}


	validateFields.push(validatePrivateKeys(privateKeys));

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
		echoRand: {
			key: null,
		},
	};

	const rolesPromises = [];
	const removed = [];

	['active'].forEach((role) => {
		(permissionForm.getIn([role, 'keys']) || []).some((keyForm) => {
			const threshold = permissionForm.getIn([role, 'threshold']);
			if (threshold && permissionTable.getIn([role, 'threshold']) !== threshold.value) {
				permissionData[role].threshold = Number(threshold.value);
			}

			if (
				!permissionTable
					.getIn([role, 'keys'])
					.some((keyTable) => keyTable.key === keyForm.get('key').value && keyTable.weight === keyForm.get('weight').value)
				|| keyForm.get('remove')
				|| permissionForm.getIn([role, 'keys']).size !== permissionTable.getIn([role, 'keys']).length
			) {
				permissionForm.getIn([role, 'keys']).forEach((value) => {
					const weightInt = parseInt(value.get('weight').value, 10);

					if (value.get('remove')) {
						removed.push('keys');
						return;
					}

					if (!value.get('key').value || !weightInt) {
						return;
					}

					permissionData[role].keys.push([value.get('key').value, weightInt]);
				});

				return true;
			}

			return false;
		});

	});

	['echoRand'].forEach((role) => {
		permissionForm.getIn([role, 'keys']).some((keyForm) => {

			if (
				!permissionTable.getIn([role, 'keys']).some((keyTable) => keyTable.key === keyForm.get('key').value)
			) {
				permissionForm.getIn([role, 'keys']).forEach((value) => {

					if (!value.get('key').value) {
						return;
					}

					permissionData[role].key = value.get('key').value;
				});

				return true;
			}

			return false;
		});

	});

	['active'].forEach((role) => {
		const accountsPromises = [];
		(permissionForm.getIn([role, 'accounts']) || []).some((keyForm) => {
			const threshold = permissionForm.getIn([role, 'threshold']);
			if (threshold && permissionTable.getIn([role, 'threshold']) !== threshold.value) {
				permissionData[role].threshold = Number(threshold.value);
			}

			if (
				!permissionTable
					.getIn([role, 'accounts'])
					.some((keyTable) => keyTable.key === keyForm.get('key').value && keyTable.weight === keyForm.get('weight').value)
				|| keyForm.get('remove')
				|| permissionForm.getIn([role, 'accounts']).size !== permissionTable.getIn([role, 'accounts']).size
			) {
				permissionForm.getIn([role, 'accounts']).forEach((value) => {
					const weightInt = parseInt(value.get('weight').value, 10);

					if (value.get('remove')) {
						removed.push('accounts');
						return;
					}

					if (!value.get('key').value || !weightInt) {
						return;
					}

					accountsPromises.push(echo.api.getAccountByName(value.get('key').value));
					permissionData[role].accounts.push([value.get('key').value, weightInt]);
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
		&& !permissionData.active.accounts.length
		&& !permissionData.echoRand.key
		&& permissionData.active.threshold === null
		&& !removed.length
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
		|| permissionData.echoRand.key
		|| removed.length
	) {
		const keysMap = [];

		permissionForm.getIn(['active', 'keys']).forEach((value) => {
			keysMap.push([value.get('key').value, parseInt(value.get('weight').value, 10)]);
		});

		transaction.active = {
			weight_threshold: currentFullAccount.getIn(['active', 'weight_threshold']),
			account_auths: currentFullAccount.getIn(['active', 'account_auths']).toJS(),
			echorand_key: currentFullAccount.get('echorand_key'),
			key_auths: keysMap,
			address_auths: [],
		};

		if (permissionData.active.threshold) {
			showOptions.activeThreshold = permissionData.active.threshold;

			transaction.active.weight_threshold = permissionData.active.threshold;
		} else {
			showOptions.activeThreshold = transaction.active.weight_threshold;
		}

		if (permissionData.active.keys.length || removed.includes('keys')) {
			showOptions.activeKeys = permissionData.active.keys;

			transaction.active.key_auths = permissionData.active.keys;
		} else if (transaction.active.key_auths.length) {
			showOptions.activeKeys = transaction.active.key_auths;
		}

		if (permissionData.active.accounts.length || removed.includes('accounts')) {
			showOptions.activeAccounts = permissionData.active.accounts;

			transaction.active.account_auths = permissionData.active.accounts;
		} else if (transaction.active.account_auths.length) {
			showOptions.activeAccounts = transaction.active.account_auths;
		}

		if (permissionData.echoRand.key) {
			showOptions.echoRandKey = permissionData.echoRand.key;

			transaction.echorand_key = permissionData.echoRand.key;
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

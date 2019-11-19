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
		key: a[0], weight: a[1], role: 'active', type: 'keys', hasWif: !!(storageSavedWifStatuses[a[0]] && storageSavedWifStatuses[a[0]].active),
	}));

	dispatch(setIn(PERMISSION_TABLE, ['active', 'keys'], new List(target)));

	target = [{
		key: account.echorand_key,
		role: 'echoRand',
		type: 'keys',
		hasWif: !!(storageSavedWifStatuses[account.echorand_key] &&
			storageSavedWifStatuses[account.echorand_key].echoRand),
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
			error = true;
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

const validateThreshold = (permissionForm) => (dispatch) => {
	const threshold = permissionForm.getIn(['active', 'threshold']).value;
	if (!isThreshold(threshold)) {
		dispatch(setInFormError(FORM_PERMISSION_KEY, ['active', 'threshold'], 'Invalid threshold'));
		return false;
	}
	return true;
};

const addEchoRandKeyToBufferObject = (permissionForm) => {
	const role = 'echoRand';
	const result = [];
	permissionForm.getIn([role, 'keys']).forEach((value) => {

		if (!value.get('key').value) {
			return;
		}

		result.push(value.get('key').value);
	});

	return result[0];
};

const addActiveKeysToBufferObject = (permissionForm) => {
	const role = 'active';
	const result = [];
	permissionForm.getIn([role, 'keys']).forEach((value) => {
		const weightInt = parseInt(value.get('weight').value, 10);

		if (!value.get('key').value || !weightInt || value.get('remove')) {
			return;
		}

		result.push([value.get('key').value, weightInt]);
	});

	return result;
};

const addActiveAccountsToBufferObject = async (permissionForm) => {
	const role = 'active';
	const result = [];

	permissionForm.getIn([role, 'accounts']).forEach((value) => {
		const weightInt = parseInt(value.get('weight').value, 10);

		if (!value.get('key').value || !weightInt || value.get('remove')) {
			return;
		}

		const accountInfo = new Promise(async (res) => {
			const account = await echo.api.getAccountByName(value.get('key').value);
			return res([account.id, weightInt]);
		});
		result.push(accountInfo);
	});

	return Promise.all(result);
};

/**
 *
 * @param {Object} permissionForm
 * @param {Object} permissionTable
 * @returns {Boolean}
 */
const isThresholdChanged = (permissionForm, permissionTable) => {
	const role = 'active';
	const threshold = permissionForm.getIn([role, 'threshold']);
	return (threshold && permissionTable.getIn([role, 'threshold']) !== threshold.value);
};

/**
 *
 * @param {Object} permissionForm
 * @returns {Number}
 */
const addThresholdToBufferObject = (permissionForm) => {
	const role = 'active';
	const threshold = permissionForm.getIn([role, 'threshold']);
	return Number(threshold.value);
};

/**
 *
 * @param {Object} permissionForm
 * @param {Object} permissionTable
 * @returns {Boolean}
 */
const isActiveKeysChanged = (permissionForm, permissionTable) => {
	const role = 'active';
	const formKeys = permissionForm.getIn([role, 'keys']);
	const tableKeys = permissionTable.getIn([role, 'keys']);

	if (formKeys.size !== tableKeys.size) {
		return true;
	}

	return formKeys.some((keyForm) => (!tableKeys.some((keyTable) =>
		keyTable.key === keyForm.get('key').value && keyTable.weight === keyForm.get('weight').value)
		|| keyForm.get('remove')
	));
};

/**
 *
 * @param {Object} permissionForm
 * @param {Object} permissionTable
 * @returns {Boolean}
 */
const isEchoRandKeysChanged = (permissionForm, permissionTable) => {
	const role = 'echoRand';
	const formKeys = permissionForm.getIn([role, 'keys']);
	const tableKeys = permissionTable.getIn([role, 'keys']);

	return formKeys.some((keyForm) => !tableKeys.some((keyTable) => keyTable.key === keyForm.get('key').value));
};

/**
 *
 * @param {Object} privateKey
 * @param {Object} basePrivateKeys
 * @param {Object} permissionForm
 * @returns {Boolean}
 */
const isActiveWifChanged = (privateKey, basePrivateKeys, permissionForm) => {
	const role = 'active';
	const formKeys = permissionForm.getIn([role, 'keys']);
	const activeKeys = privateKey.active;
	const baseActiveKeys = basePrivateKeys.active;

	const newPrivateKeys = Object.entries(activeKeys)
		.filter(([index]) => formKeys.getIn([index, 'key']) && formKeys.getIn([index, 'key']).value)
		.reduce((acc, [index, wif]) => {
			acc[formKeys.getIn([index, 'key']).value] = (wif && wif.value) ?
				{ value: wif.value } : { value: undefined };
			return acc;
		}, {});

	const oldPrivateKeys = Object.entries(baseActiveKeys)
		.reduce((acc, [key, wif]) => {
			acc[key] = (wif && wif.value) ? { value: wif.value } : { value: undefined };
			return acc;
		}, {});

	const addedPubWithoutWif = Object.keys(newPrivateKeys)
		.filter((k) => !oldPrivateKeys[k] && !newPrivateKeys[k].value);
	for (let i = 0; i < addedPubWithoutWif.length; i += 1) {
		delete newPrivateKeys[addedPubWithoutWif[i]];
	}
	return Object.keys(newPrivateKeys).length !== Object.keys(oldPrivateKeys).length ||
		!Object.entries(oldPrivateKeys).every(([key, wif]) =>
			(newPrivateKeys[key] && !!newPrivateKeys[key].value === !!wif.value));
};

/**
 *
 * @param {Object} privateKey
 * @param {Object} basePrivateKeys
 * @param {Object} permissionForm
 * @returns {Boolean}
 */
const isEchoRandWifChanged = (privateKey, basePrivateKeys, permissionForm) => {
	const role = 'echoRand';
	const formKeys = permissionForm.getIn([role, 'keys']);
	const echoRandKeys = privateKey.echoRand;
	const baseEchoRandKeys = basePrivateKeys.echoRand;

	const newPrivateKeys = Object.entries(echoRandKeys)
		.filter(([index]) => formKeys.getIn([index, 'key']) && formKeys.getIn([index, 'key']).value)
		.reduce((acc, [index, wif]) => {
			acc[formKeys.getIn([index, 'key']).value] = (wif && wif.value) ?
				{ value: wif.value } : { value: undefined };
			return acc;
		}, {});

	const oldPrivateKeys = Object.entries(baseEchoRandKeys)
		.reduce((acc, [key, wif]) => {
			acc[key] = (wif && wif.value) ? { value: wif.value } : { value: undefined };
			return acc;
		}, {});

	return Object.keys(newPrivateKeys).length !== Object.keys(oldPrivateKeys).length ||
		!Object.entries(oldPrivateKeys).every(([key, wif]) =>
			(newPrivateKeys[key] && !!newPrivateKeys[key].value === !!wif.value));
};

/**
 *
 * @param {Object} permissionForm
 * @param {Object} permissionTable
 * @returns {Boolean}
 */
const isActiveAccountsChanged = (permissionForm, permissionTable) => {
	const role = 'active';
	const formKeys = permissionForm.getIn([role, 'accounts']);
	const tableKeys = permissionTable.getIn([role, 'accounts']);

	if (formKeys.size !== tableKeys.size) {
		return true;
	}

	return formKeys.some((keyForm) => (!tableKeys.some((keyTable) =>
		keyTable.key === keyForm.get('key').value && keyTable.weight === keyForm.get('weight').value)
		|| keyForm.get('remove')
	));

};

/**
 * @method permissionTransaction
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const permissionTransaction = (privateKeys, basePrivateKeys) =>
	async (dispatch, getState) => {
		const currentAccount = getState().global.get('activeUser');
		const currentFullAccount = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, currentAccount.get('id')]);
		const permissionForm = getState().form.get(FORM_PERMISSION_KEY);
		const permissionTable = getState().table.get(PERMISSION_TABLE);

		const roles = ['active', 'echoRand'];

		const validateFields = [];
		roles.forEach((role) => {
			permissionForm.getIn([role, 'keys']).mapEntries(([keyTable, keyForm]) => {
				if (!keyForm.get('remove')) {
					validateFields.push(dispatch(validateKey(
						role,
						keyTable,
						'keys',
						keyForm.get('key'),
						keyForm.get('weight'),
					)));
				}
			});
		});

		permissionForm.getIn(['active', 'accounts']).mapEntries(([keyTable, keyForm]) => {
			if (!keyForm.get('remove')) {
				validateFields.push(dispatch(validateKey(
					'active',
					keyTable,
					'accounts',
					keyForm.get('key'),
					keyForm.get('weight'),
				)));
			}
		});

		validateFields.push(!dispatch(validateThreshold(permissionForm)));
		validateFields.push(validatePrivateKeys(privateKeys));

		const errors = await Promise.all(validateFields);

		if (errors.includes(true)) {
			return { validation: false, isWifChangingOnly: false };
		}

		const permissionData = {
			active: {
				keys: [],
				accounts: [],
				threshold: null,
				echorand_key: null,
			},
			echoRand: {
				key: null,
			},
		};

		const dataChanged = {
			active: {
				keys: false,
				accounts: false,
				threshold: false,
				wif: false,
			},
			echoRand: {
				key: false,
				wif: false,
			},
		};

		dataChanged.active.keys = isActiveKeysChanged(permissionForm, permissionTable);
		dataChanged.active.accounts = isActiveAccountsChanged(permissionForm, permissionTable);
		dataChanged.active.threshold = isThresholdChanged(permissionForm, permissionTable);
		dataChanged.echoRand.key = isEchoRandKeysChanged(permissionForm, permissionTable);
		dataChanged.active.wif = isActiveWifChanged(privateKeys, basePrivateKeys, permissionForm);
		dataChanged.echoRand.wif = isEchoRandWifChanged(privateKeys, basePrivateKeys, permissionForm);

		if (dataChanged.active.keys) {
			permissionData.active.keys = addActiveKeysToBufferObject(permissionForm);
		}

		if (dataChanged.active.threshold) {
			permissionData.active.threshold = addThresholdToBufferObject(permissionForm);
		}

		if (dataChanged.echoRand.key) {
			permissionData.echoRand.key = addEchoRandKeyToBufferObject(permissionForm);
		}

		if (dataChanged.active.accounts) {
			permissionData.active.accounts = await addActiveAccountsToBufferObject(permissionForm);
		}

		if (
			!(
				dataChanged.active.keys
				|| dataChanged.active.accounts
				|| dataChanged.active.threshold
				|| dataChanged.active.wif
				|| dataChanged.echoRand.key
				|| dataChanged.echoRand.wif
			)
		) {
			return { validation: false, isWifChangingOnly: false };
		}

		await echo.api.getGlobalProperties(true);
		const feeAsset = await echo.api.getObject(ECHO_ASSET_ID);

		const transaction = {
			account: currentAccount.get('id'),
		};

		const showOptions = {
			account: currentAccount.get('name'),
		};

		const isWifChangingOnly =
			!dataChanged.active.keys
			&& !dataChanged.active.accounts
			&& !dataChanged.active.threshold
			&& !dataChanged.echoRand.key
			&& (dataChanged.active.wif
			|| dataChanged.echoRand.wif);

		if (
			dataChanged.active.keys
			|| dataChanged.active.accounts
			|| dataChanged.active.threshold
			|| dataChanged.active.wif
			|| dataChanged.echoRand.key
			|| dataChanged.echoRand.wif
		) {
			if (
				dataChanged.active.keys
				|| dataChanged.active.accounts
				|| dataChanged.active.threshold
			) {
				transaction.active = {
					weight_threshold: currentFullAccount.getIn(['active', 'weight_threshold']),
					account_auths: currentFullAccount.getIn(['active', 'account_auths']).toJS(),
					key_auths: currentFullAccount.getIn(['active', 'key_auths']).toJS(),
				};
			}

			if (dataChanged.active.threshold) {
				showOptions.activeThreshold = permissionData.active.threshold;

				transaction.active.weight_threshold = permissionData.active.threshold;
			}

			if (dataChanged.active.keys) {
				showOptions.activeKeys = permissionData.active.keys;

				transaction.active.key_auths = permissionData.active.keys;
			}

			if (dataChanged.active.accounts) {
				showOptions.activeAccounts = permissionData.active.accounts;

				transaction.active.account_auths = permissionData.active.accounts;
			}

			if (dataChanged.echoRand.key) {
				showOptions.echoRandKey = permissionData.echoRand.key;

				transaction.echorand_key = permissionData.echoRand.key;
			}

			if (dataChanged.active.wif || dataChanged.echoRand.wif) {
				showOptions.wif = [];
				if (dataChanged.active.wif) {
					showOptions.wif.push('Changed active wif');
				}
				if (dataChanged.echoRand.wif) {
					showOptions.wif.push('Changed echo rand wif');
				}
			}

		}

		if (!isWifChangingOnly) {
			const feeValue = await getOperationFee('account_update', transaction);

			transaction.fee = {
				amount: feeValue,
				asset_id: ECHO_ASSET_ID,
			};

			showOptions.fee = `${feeValue / (10 ** feeAsset.precision)} ${feeAsset.symbol}`;
		}

		dispatch(resetTransaction());

		dispatch(TransactionReducer.actions.setOperation({
			operation: 'account_update',
			options: isWifChangingOnly ? {} : transaction,
			showOptions,
		}));

		return { validation: true, isWifChangingOnly };
	};

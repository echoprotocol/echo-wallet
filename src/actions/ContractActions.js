import { Map, List } from 'immutable';
import echo, { validators } from 'echojs-lib';
import * as wrapper from 'solc/wrapper';

import {
	setFormError,
	setValue,
	setInFormValue,
	clearForm,
	setInFormErrorConstant,
	setFormValue,
} from './FormActions';
import { push, remove, update } from './GlobalActions';
import { convert } from './ConverterActions';

import GlobalReducer from '../reducers/GlobalReducer';
import ContractReducer from '../reducers/ContractReducer';
import ContractFeeReducer from '../reducers/ContractFeeReducer';

import { formatError } from '../helpers/FormatHelper';
import { getMethod, getContractId, getMethodId } from '../helpers/ContractHelper';
import { toastInfo } from '../helpers/ToastHelper';

import { getSolcList } from '../services/ApiService';

import {
	validateAbi,
	validateContractName,
	validateByType,
	checkAccessVersion,
} from '../helpers/ValidateHelper';

import {
	FORM_ADD_CONTRACT,
	FORM_CALL_CONTRACT,
	FORM_CREATE_CONTRACT,
	FORM_VIEW_CONTRACT,
} from '../constants/FormConstants';
import { CONTRACT_LIST_PATH, VIEW_CONTRACT_PATH } from '../constants/RouterConstants';
import {
	CONTRACT_ID_PREFIX,
	TIME_REMOVE_CONTRACT,
	ECHO_ASSET_ID,
	MIN_ACCESS_VERSION_BUILD,
} from '../constants/GlobalConstants';

import history from '../history';

import { estimateFormFee } from './TransactionActions';
import { loadScript } from '../api/ContractApi';

/**
 * @method set
 *
 * @param {String} field
 * @param {any} value
 * @returns {function(dispatch): Promise<undefined>}
 */
export const set = (field, value) => (dispatch) => {
	dispatch(ContractReducer.actions.set({ field, value }));
};

/**
 * @method loadContracts
 *
 * @param {String} accountId
 * @param {String} networkName
 * @returns {function(dispatch): Promise<undefined>}
 */
export const loadContracts = (accountId, networkName) => (dispatch) => {
	let contracts = localStorage.getItem(`contracts_${networkName}`);

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		dispatch(GlobalReducer.actions.set({
			field: 'contracts',
			value: new Map({}),
		}));
		return;
	}

	dispatch(GlobalReducer.actions.set({
		field: 'contracts',
		value: new Map(contracts[accountId]),
	}));
};

/**
 * @method addContract
 *
 * @param {String} name
 * @param {String} id
 * @param {String} abi
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const addContract = (name, id, abi) => async (dispatch, getState) => {
	const nameError = validateContractName(name);
	const idError = !validators.isContractId(id);
	const abiError = validateAbi(abi);

	if (nameError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'name', nameError));
		return;
	}

	if (idError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'id', 'Invalid contract ID'));
		return;
	}

	if (abiError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'abi', abiError));
		return;
	}

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	try {
		const contract = await echo.api.getContract(id);

		if (!contract) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'id', 'Invalid contract ID'));
			return;
		}

		let contracts = localStorage.getItem(`contracts_${networkName}`);

		contracts = contracts ? JSON.parse(contracts) : {};

		if (!contracts[accountId]) {
			contracts[accountId] = {};
		}

		if (contracts[accountId][id]) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'name', `Contract "${name}" already exists`));
			return;
		}

		if (Object.values(contracts[accountId]).map((i) => i.id).includes(id)) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'id', `Contract ${id} already exists`));
			return;
		}

		contracts[accountId][id] = { abi, name };
		localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));

		dispatch(push('contracts', id, { disabled: false, abi, name }));

		history.push(CONTRACT_LIST_PATH);
	} catch (err) {
		dispatch(setValue(FORM_ADD_CONTRACT, 'error', formatError(err)));
	}
};

/**
 * @method removeContract
 *
 * @param {String} name
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const removeContract = (id) => (dispatch, getState) => {
	if (!getState().global.getIn(['contracts', id]).disabled) {
		return;
	}

	dispatch(remove('contracts', id));

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	let contracts = localStorage.getItem(`contracts_${networkName}`);

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	delete contracts[accountId][id];
	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));
};

/**
 * @method enableContract
 *
 * @param {String} id
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const enableContract = (id) => (dispatch, getState) => {
	const intervalId = getState().contract.get('intervalId');
	clearTimeout(intervalId);
	dispatch(update('contracts', id, { disabled: false }));
};

/**
 * @method disableContract
 *
 * @param {String} id
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const disableContract = (id) => (dispatch) => {
	dispatch(update('contracts', id, { disabled: true }));

	history.push(CONTRACT_LIST_PATH);

	toastInfo(
		`You have removed ${id} from watch list`,
		() => dispatch(enableContract(id)),
		() => {
			const intervalId = setTimeout(() => dispatch(removeContract(id)), TIME_REMOVE_CONTRACT);
			dispatch(ContractReducer.actions.set({
				field: 'intervalId',
				value: intervalId,
			}));
		},
	);
};

/**
 * @method addContractByName
 *
 * @param {String} contractResultId
 * @param {String} accountId
 * @param {String} name
 * @param {String} abi
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const addContractByName = (
	contractResultId,
	accountId,
	name,
	abi,
) => async (dispatch, getState) => {
	const networkName = getState().global.getIn(['network', 'name']);

	const address = (await echo.api.getContractResult(contractResultId))[1].exec_res.new_address;

	const id = `${CONTRACT_ID_PREFIX}.${getContractId(address)}`;

	let contracts = localStorage.getItem(`contracts_${networkName}`);

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	contracts[accountId][id] = {
		abi,
		name,
	};

	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));

	dispatch(push('contracts', id, { disabled: false, abi, name }));
};

/**
 * parameters
 * method: {
 *     name,
 *     inputs: ARRAY: {
 *         type
 *     }
 * },
 * args: ARRAY,
 * contractId,
 */
/**
 * @method contractQuery
 *
 * @param {Object} method
 * @param {Array} args
 * @param {String} contractId
 * @returns {function(dispatch, getState): Promise<(Object | undefined)>}
 */
export const contractQuery = (method, args, contractId) => async (dispatch, getState) => {
	let isErrorExist = false;

	method.inputs.forEach((input, index) => {
		const error = validateByType(args[index], input.type);
		if (error) {
			dispatch(setInFormErrorConstant(FORM_VIEW_CONTRACT, ['inputs', method.name, index], error));
			isErrorExist = true;
		}
	});

	if (isErrorExist) {
		const constants = getState().contract.get('constants');
		const newConstants = constants.toJS().map((constant) => {
			if (constant.name === method.name) {
				constant.showQueryResult = false;
			}
			return constant;
		});
		dispatch(ContractReducer.actions.set({ field: 'constants', value: new List(newConstants) }));
		return;
	}

	const accountId = getState().global.getIn(['activeUser', 'id']);

	const queryResult = await echo.api.callContractNoChangingState(
		contractId,
		accountId,
		{ amount: 0, asset_id: ECHO_ASSET_ID },
		getMethod(method, args),
	);

	const constants = getState().contract.get('constants');
	const newConstants = constants.toJS().map((constant) => {
		if (constant.name === method.name) {
			constant.constantValue = queryResult;
			constant.showQueryResult = true;
		}
		return constant;
	});

	const convertedConstants = getState().converter.get('convertedConstants').toJS();
	convertedConstants.map((val) => {
		if (val.name === method.name) {
			dispatch(convert(val.type, queryResult, method));
		}
		return val;
	});

	dispatch(ContractReducer.actions.set({ field: 'constants', value: new List(newConstants) }));
};

/**
 * @method formatAbi
 *
 * @param {String} contractName
 * @@returns {function(dispatch, getState): Promise<Object>}
 */
export const formatAbi = (id) => async (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	const contracts = JSON.parse(localStorage.getItem(`contracts_${networkName}`));
	const abi = JSON.parse(contracts[accountId][id].abi);
	const { name } = contracts[accountId][id];

	let constants = abi.filter((value) =>
		value.constant && value.name);

	constants.forEach((constant) => {
		if (constant.inputs.length) {
			Object.keys(constant.inputs)
				.forEach((input) => {
					dispatch(setInFormValue(FORM_VIEW_CONTRACT, ['inputs', constant.name, input], ''));
				});
		}
	});

	constants = constants.map(async (constant) => {
		const method = getMethodId(constant);

		const constantValue = await echo.api.callContractNoChangingState(
			id,
			accountId,
			{ amount: 0, asset_id: ECHO_ASSET_ID },
			method,
		);
		constant.constantValue = constantValue.substr(-64);
		constant.showQueryResult = false;
		return constant;
	});

	constants = await Promise.all(constants);

	dispatch(ContractReducer.actions.set({
		field: 'constants',
		value: new List(constants),
	}));

	const functions = abi.filter((value) => !value.constant && value.name && value.type === 'function');

	dispatch(ContractReducer.actions.set({
		field: 'functions',
		value: new List(functions),
	}));

	dispatch(ContractReducer.actions.set({
		field: 'id',
		value: id,
	}));

	dispatch(ContractReducer.actions.set({
		field: 'name',
		value: name,
	}));

};

/**
 * @method updateContractName
 *
 * @param {String} oldName
 * @param {String} newName
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const updateContractName = (id, newName) => (dispatch, getState) => {
	const nameError = validateContractName(newName);

	if (nameError) {
		dispatch(setFormError(FORM_VIEW_CONTRACT, 'newName', nameError));
		return;
	}

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	let contracts = localStorage.getItem(`contracts_${networkName}`);

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	const newContracts = {};
	Object.entries(contracts).forEach((account) => {
		newContracts[account[0]] = {};
		Object.entries(account[1])
			.forEach((contract) => {
				if (contract[0] === id && accountId === account[0]) {
					newContracts[account[0]][id] = { ...contract[1], name: newName };
				} else {
					[, newContracts[account[0]][contract[0]]] = contract;
				}
			});
	});

	// contracts[accountId][id] = contracts[accountId][id];
	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(newContracts));

	dispatch(remove('contracts', id));
	dispatch(push('contracts', id, {
		disabled: false,
		abi: contracts[accountId][id].abi,
		id: contracts[accountId][id].id,
		name: newName,
	}));

	dispatch(formatAbi(id));

	history.replace(VIEW_CONTRACT_PATH.replace(/:id/, id));
};


/**
 * @method setFunction
 *
 * @param {String} functionName
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setFunction = (functionName) => (dispatch, getState) => {
	const functions = getState().contract.get('functions') || [];

	const targetFunction = functions.find((f) => (f.name === functionName));

	if (!targetFunction) return;

	dispatch(clearForm(FORM_CALL_CONTRACT));

	targetFunction.inputs.forEach((i) => {
		dispatch(setInFormValue(FORM_CALL_CONTRACT, ['inputs', i.name], ''));
	});

	dispatch(setValue(FORM_CALL_CONTRACT, 'functionName', functionName));
	if (!targetFunction.payable) return;

	dispatch(setValue(FORM_CALL_CONTRACT, 'payable', true));
};

/**
 * @method setContractFees
 *
 * @param {String} form
 * @returns {function(dispatch, getState): Promise<Object>}
 */
export const setContractFees = (form) => async (dispatch, getState) => {
	const formData = getState().form.getIn([form]).toJS();
	if (!formData.id.value || !formData.amount.value) {
		return;
	}
	const assets = getState().balance.get('assets').toArray();
	let fees = assets.reduce((arr, asset) => {
		const value = dispatch(estimateFormFee(asset, form));
		arr.push(value);
		return arr;
	}, []);

	fees = await Promise.all(fees);


	if (fees.some((value) => value === null)) {
		if (form === FORM_CALL_CONTRACT) {
			dispatch(setValue(form, 'feeError', 'Can\'t be calculated'));
		} else {
			dispatch(setFormError(form, 'amount', 'Fee can\'t be calculated'));
		}
	} else {
		dispatch(setValue(form, 'feeError', null));
		dispatch(setFormError(form, 'amount', null));
	}

	fees = fees.reduce((arr, value, i) => {
		if (value) {
			arr.push({
				value,
				asset: assets[i],
			});
		}
		return arr;
	}, []);

	const currency = getState().form.getIn([form, 'currency']);
	const fee = fees
		.find((el) => el.asset.id === currency && currency.id) || (fees.length && fees[0]);
	dispatch(setValue(form, 'fee', { error: null, ...fee }));
	dispatch(ContractFeeReducer.actions.set({ value: fees.length ? fees : null }));
	return fee;
};

/**
 *
 * @param name
 * @returns {Promise<Array<Asset>>}
 */
export const getAssetsList = async (name) => {
	const list = await echo.api.listAssets(name, 15);
	return list;
};

/**
 *
 * @returns {Function}
 */
export const contractCompilerInit = () => async (dispatch) => {
	const list = await getSolcList();
	list.builds = list.builds.filter(({ version }) =>
		checkAccessVersion(version, MIN_ACCESS_VERSION_BUILD));

	dispatch(setValue(FORM_CREATE_CONTRACT, 'compilersList', new Map(list)));

	const solcLatestRelease = list.latestRelease ?
		list.releases[list.latestRelease] : list.builds[list.builds.length - 1].path;

	const lastVersion = list.builds.find((b) => b.path === solcLatestRelease);

	dispatch(setFormValue(FORM_CREATE_CONTRACT, 'currentCompiler', lastVersion && lastVersion.longVersion));

	await loadScript(`${SOLC_BIN_URL}${solcLatestRelease}`); // eslint-disable-line no-undef
};

/**
 *
 * @returns {Function}
 */
export const resetCompiler = () => (dispatch) => {
	dispatch(setFormValue(FORM_CREATE_CONTRACT, 'abi', ''));
	dispatch(setFormValue(FORM_CREATE_CONTRACT, 'bytecode', ''));
	dispatch(setFormValue(FORM_CREATE_CONTRACT, 'name', ''));
	dispatch(setValue(FORM_CREATE_CONTRACT, 'contracts', new Map({})));
};

/**
 *
 * @returns {Function}
 */
export const contractCodeCompile = () => async (dispatch, getState) => {
	const filename = 'test.sol';
	const code = getState().form.getIn([FORM_CREATE_CONTRACT, 'code']);
	dispatch(setFormError(FORM_CREATE_CONTRACT, 'code', ''));

	try {
		const input = {
			language: 'Solidity',
			sources: {
				[filename]: {
					content: code.value,
				},
			},
			settings: {
				outputSelection: {
					'*': {
						'*': ['*'],
					},
				},
			},
		};

		const solc = wrapper(window.Module);
		const output = JSON.parse(solc.compile(JSON.stringify(input)));
		let contracts = new Map({});
		contracts = contracts.withMutations((contractsMap) => {
			Object.entries(output.contracts[filename]).forEach(([name, contract]) => {
				contractsMap.setIn([name, 'abi'], JSON.stringify(contract.abi));
				contractsMap.setIn([name, 'bytecode'], contract.evm.bytecode.object);
			});
		});

		dispatch(setFormValue(FORM_CREATE_CONTRACT, 'abi', JSON.stringify(Object.values(output.contracts[filename])[0].abi)));
		dispatch(setFormValue(FORM_CREATE_CONTRACT, 'bytecode', Object.values(output.contracts[filename])[0].evm.bytecode.object));
		dispatch(setFormValue(FORM_CREATE_CONTRACT, 'name', Object.keys(output.contracts[filename])[0]));
		dispatch(setValue(FORM_CREATE_CONTRACT, 'contracts', contracts));
	} catch (err) {
		dispatch(resetCompiler());
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'code', 'Invalid contract code'));
	}
};

/**
 *
 * @param version
 * @returns {Function}
 */
export const changeContractCompiler = (version) => async (dispatch, getState) => {
	const buildsList = getState().form.getIn([FORM_CREATE_CONTRACT, 'compilersList', 'builds']);
	dispatch(setFormValue(FORM_CREATE_CONTRACT, 'currentCompiler', version));
	const compilerBuild = buildsList.find((build) => build.longVersion === version);
	await loadScript(`${SOLC_BIN_URL}${compilerBuild.path}`); // eslint-disable-line no-undef
	const code = getState().form.getIn([FORM_CREATE_CONTRACT, 'code']);
	if (!code || !code.value) {
		return;
	}
	await dispatch(contractCodeCompile());
};

import { Map, List } from 'immutable';
import echo from 'echojs-lib';

import {
	setFormError,
	setValue,
	setInFormValue,
	clearForm,
	setInFormErrorConstant,
} from './FormActions';
import { push, remove, update } from './GlobalActions';
import { convert } from './ConverterActions';

import GlobalReducer from '../reducers/GlobalReducer';
import ContractReducer from '../reducers/ContractReducer';
import ContractFeeReducer from '../reducers/ContractFeeReducer';

import { formatError } from '../helpers/FormatHelper';
import { getMethod, getContractId, getMethodId } from '../helpers/ContractHelper';
import { toastInfo } from '../helpers/ToastHelper';

import {
	validateAbi,
	validateContractName,
	validateContractId, validateByType,
} from '../helpers/ValidateHelper';

import { FORM_ADD_CONTRACT, FORM_CALL_CONTRACT, FORM_VIEW_CONTRACT } from '../constants/FormConstants';
import { CONTRACT_LIST_PATH, VIEW_CONTRACT_PATH } from '../constants/RouterConstants';
import { CONTRACT_ID_PREFIX, TIME_REMOVE_CONTRACT, ECHO_ASSET_ID } from '../constants/GlobalConstants';

import history from '../history';

import { estimateFormFee } from './TransactionActions';

export const set = (field, value) => (dispatch) => {
	dispatch(ContractReducer.actions.set({ field, value }));
};

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

export const addContract = (name, id, abi) => async (dispatch, getState) => {
	const nameError = validateContractName(name);
	const idError = validateContractId(id);
	const abiError = validateAbi(abi);

	if (nameError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'name', nameError));
		return;
	}

	if (idError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'id', idError));
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

		if (contracts[accountId][name]) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'name', `Contract "${name}" already exists`));
			return;
		}

		if (Object.values(contracts[accountId]).map((i) => i.id).includes(id)) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'id', `Contract ${id} already exists`));
			return;
		}

		contracts[accountId][name] = { abi, id };
		localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));

		dispatch(push('contracts', name, { disabled: false, abi, id }));

		history.push(CONTRACT_LIST_PATH);
	} catch (err) {
		dispatch(setValue(FORM_ADD_CONTRACT, 'error', formatError(err)));
	}
};

export const removeContract = (name) => (dispatch, getState) => {
	if (!getState().global.getIn(['contracts', name]).disabled) {
		return;
	}

	dispatch(remove('contracts', name));

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	let contracts = localStorage.getItem(`contracts_${networkName}`);

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	delete contracts[accountId][name];
	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));
};

export const enableContract = (name) => (dispatch, getState) => {
	const intervalId = getState().contract.get('intervalId');
	clearTimeout(intervalId);
	dispatch(update('contracts', name, { disabled: false }));
};

export const disableContract = (name) => (dispatch) => {
	dispatch(update('contracts', name, { disabled: true }));

	history.push(CONTRACT_LIST_PATH);

	toastInfo(
		`You have removed ${name} from watch list`,
		() => dispatch(enableContract(name)),
		() => {
			const intervalId = setTimeout(() => dispatch(removeContract(name)), TIME_REMOVE_CONTRACT);
			dispatch(ContractReducer.actions.set({
				field: 'intervalId',
				value: intervalId,
			}));
		},
	);
};

export const updateContractName = (oldName, newName) => (dispatch, getState) => {
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
				if (contract[0] === oldName && accountId === account[0]) {
					[, newContracts[account[0]][newName]] = contract;
				} else {
					[, newContracts[account[0]][contract[0]]] = contract;
				}
			});
	});

	contracts[accountId][newName] = contracts[accountId][oldName];
	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(newContracts));

	dispatch(remove('contracts', oldName));
	dispatch(push('contracts', newName, {
		disabled: false,
		abi: contracts[accountId][newName].abi,
		id: contracts[accountId][newName].id,
	}));

	history.replace(VIEW_CONTRACT_PATH.replace(/:name/, newName));
};

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

	contracts[accountId][name] = {
		abi,
		id,
	};
	localStorage.setItem(`contracts_${networkName}`, JSON.stringify(contracts));

	dispatch(push('contracts', name, { disabled: false, abi, id }));
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
		ECHO_ASSET_ID,
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

export const formatAbi = (contractName) => async (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	const contracts = JSON.parse(localStorage.getItem(`contracts_${networkName}`));
	const abi = JSON.parse(contracts[accountId][contractName].abi);
	const contractId = contracts[accountId][contractName].id;

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
			contractId,
			accountId,
			ECHO_ASSET_ID,
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
		value: contractId,
	}));

};

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


export const setContractFees = (form) => async (dispatch, getState) => {

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
};


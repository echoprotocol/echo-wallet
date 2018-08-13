import { Map, List } from 'immutable';

import {
	getContractId,
	getContract,
	getContractConstant,
	getContractResult,
} from '../api/ContractApi';

import GlobalReducer from '../reducers/GlobalReducer';
import ContractReducer from '../reducers/ContractReducer';

import { getMethod } from '../helpers/ContractHelper';
import {
	validateAbi,
	validateContractName,
	validateContractId,
} from '../helpers/ValidateHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';

import ContractReducer from '../reducers/ContractReducer';

import { getMethod } from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';
import { FORM_ADD_CONTRACT, FORM_VIEW_CONTRACT } from '../constants/FormConstants';
import { CONTRACT_LIST_PATH, VIEW_CONTRACT_PATH } from '../constants/RouterConstants';

import { setFormError, setValue, pushForm } from './FormActions';
import { push, remove, update } from './GlobalActions';

import history from '../history';

export const loadContracts = (accountId) => (dispatch) => {
	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) { return; }

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

	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);

	try {
		const contract = await getContract(instance, id);

		if (!contract) {
			dispatch(setFormError(FORM_ADD_CONTRACT, 'id', 'Invalid contract ID'));
			return;
		}

		let contracts = localStorage.getItem('contracts');

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
		localStorage.setItem('contracts', JSON.stringify(contracts));

		dispatch(push('contracts', name, { disabled: false, abi, id }));

		history.push(CONTRACT_LIST_PATH);
		toastSuccess(`Contract ${name} successfully added`);
	} catch (err) {
		dispatch(setValue(FORM_ADD_CONTRACT, 'error', err));
	}
};

export const removeContract = (name) => (dispatch, getState) => {
	if (!getState().global.getIn(['contracts', name]).disabled) {
		return;
	}

	dispatch(remove('contracts', name));

	const accountId = getState().global.getIn(['activeUser', 'id']);

	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	delete contracts[accountId][name];
	localStorage.setItem('contracts', JSON.stringify(contracts));
};

export const enableContract = (name) => (dispatch) => {
	dispatch(update('contracts', name, { disabled: false }));
};

export const disableContract = (name) => (dispatch) => {
	dispatch(update('contracts', name, { disabled: true }));

	history.push(CONTRACT_LIST_PATH);

	toastInfo(
		`You have removed ${name} from watch list`,
		() => dispatch(enableContract(name)),
		() => setTimeout(() => dispatch(removeContract(name)), 1000),
	);
};

export const updateContractName = (oldName) => (dispatch, getState) => {
	const newName = getState().form.getIn([FORM_VIEW_CONTRACT, 'newName']).value;

	const nameError = validateContractName(newName);

	if (nameError) {
		dispatch(setFormError(FORM_ADD_CONTRACT, 'name', nameError));
		return;
	}

	const accountId = getState().global.getIn(['activeUser', 'id']);

	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	contracts[accountId][newName] = contracts[accountId][oldName];
	delete contracts[accountId][oldName];
	localStorage.setItem('contracts', JSON.stringify(contracts));

	dispatch(remove('contracts', oldName));

	dispatch(push('contracts', newName, {
		disabled: false,
		abi: contracts[accountId][newName].abi,
		id: contracts[accountId][newName].id,
	}));

	history.push(VIEW_CONTRACT_PATH.replace(/:name/, newName));
};

export const addContractByName = (
	contractResultId,
	accountId,
	name,
	abi,
) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);

	const address = (await getContractResult(instance, contractResultId)).exec_res.new_address;

	const id = `1.16.${getContractId(address)}`;

	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	contracts[accountId][name] = {
		abi,
		id,
	};
	localStorage.setItem('contracts', JSON.stringify(contracts));

	dispatch(push('contracts', name, { disabled: false, abi, id }));

	toastSuccess(`Contract ${name} successfully added`);
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
	const instance = getState().echojs.getIn(['system', 'instance']);

	const accountId = getState().global.getIn(['activeUser', 'id']);

	const queryResult = await getContractConstant(
		instance,
		accountId,
		contractId,
		getMethod(method, args),
	);

	const constants = getState().contract.get('constants');
	const newConstants = constants.toJS().map((constant) => {
		if (constant.name === method.name) {
			constant.constantValue = queryResult;
		}
		return constant;
	});

	dispatch(ContractReducer.actions.set({ field: 'constants', value: new List(newConstants) }));
};

export const formatAbi = (contractName) => async (dispatch, getState) => {

	const instance = getState()
		.echojs
		.getIn(['system', 'instance']);

	const accountId = getState()
		.global
		.getIn(['activeUser', 'id']);

	const contractId = JSON.parse(localStorage.getItem('contracts'))[accountId][contractName].id;

	const abi = JSON.parse(JSON.parse(localStorage.getItem('contracts'))[accountId][contractName].abi);

	if (isConst) {
		let constants = abi.filter((value) =>
			value.constant && value.name);

		constants.forEach((constant) => {
			if (constant.inputs.length) {
				Object.keys(constant.inputs)
					.forEach((input) => {
						dispatch(pushForm(
							FORM_VIEW_CONTRACT,
							[constant.name, input],
							{
								value: '',
								error: null
							},
						));
					});
			}
		});

		constants = constants.map(async (constant) => {
			const method = formatSignature(constant);
			let constantValue =
				await getContractConstant(instance, contractId, accountId, method);
			if (constant.outputs[0].type === 'string') {
				constantValue = toUtf8(constantValue.substr(-64));
			} else if (constant.outputs[0].type === 'bool') {
				constantValue = !!toInt(constantValue.substr(-64));
			} else {
				constantValue = toInt(constantValue.substr(-64));
			}
			return Object.defineProperty(constant, 'constantValue', {
				value: constantValue,
				writable: true,
				enumerable: true,
				configurable: true,
			});
		});

		constants = await Promise.all(constants);

		dispatch(ContractReducer.actions.set({
			field: 'constants',
			value: new List(constants)
		}));
	} else {
		const functions = abi.filter((value) => !value.constant && value.name && value.type === 'function');
		dispatch(ContractReducer.actions.set({
			field: 'functions',
			value: new List(functions)
		}));
	}
	dispatch(ContractReducer.actions.set({
		field: 'id',
		value: contractId
	}));
}

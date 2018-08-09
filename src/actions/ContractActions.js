import { Map, List } from 'immutable';

import {
	getContractId,
	getContract,
	getContractConstant,
	formatSignature,
	getContractResult,
} from '../api/ContractApi';

import {
	validateAbi,
	validateContractName,
	validateContractId,
} from '../helpers/ValidateHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';

import ContractReducer from '../reducers/ContractReducer';

import { getMethod } from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';
import { FORM_ADD_CONTRACT } from '../constants/FormConstants';
import { CONTRACT_LIST_PATH } from '../constants/RouterConstants';

import { setFormError, setValue } from './FormActions';
import { push, remove, update } from './GlobalActions';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import erc20 from '../../config/erc20.abi.test.json';

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


	await getContractConstant(
		instance,
		accountId,
		contractId,
		getMethod(method, args),
	);

};

export const formatAbi = (contractId, isConst) => async (dispatch, getState) => {

	const instance = getState().echojs.getIn(['system', 'instance']);

	const accountId = getState().global.getIn(['activeUser', 'id']);

	const abi = erc20;
	// const abi = JSON.parse(localStorage.getItem('contracts'))[accountId][contractId];

	if (isConst) {
		let constants = abi.filter((value) =>
			value.constant && value.name);

		constants = constants.map(async (constant) => {
			const method = formatSignature(constant);
			let constantValue =
				await getContractConstant(instance, contractId, accountId, method);
			if (constant.outputs[0].type === 'string') {
				constantValue = toUtf8(constantValue.substr(-64));
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

		dispatch(ContractReducer.actions.set({ field: 'constants', value: new List(constants) }));
	} else {
		abi.filter((value) => !value.constant && value.name && value.type === 'function');
	}
};

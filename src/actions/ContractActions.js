import { Map } from 'immutable';

import {
	getContractId,
	getContract,
	getContractConstant,
	formatSignature,
	getContractResult,
} from '../api/ContractApi';

import { getMethod } from '../helpers/ContractHelper';
import {
	validateAbi,
	validateContractName,
	validateContractId,
} from '../helpers/ValidateHelper';
import { toastSuccess } from '../helpers/ToastHelper';

import { FORM_ADD_CONTRACT } from '../constants/FormConstants';
import { SMART_CONTRACTS_PATH } from '../constants/RouterConstants';

import { setFormError, setValue } from './FormActions';

import GlobalReducer from '../reducers/GlobalReducer';

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

		dispatch(GlobalReducer.actions.push({
			field: 'contracts',
			param: name,
			value: { abi, id },
		}));

		history.push(SMART_CONTRACTS_PATH);
		toastSuccess(`Contract ${name} successfully added`);
	} catch (err) {
		dispatch(setValue(FORM_ADD_CONTRACT, 'error', err));
	}
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

	dispatch(GlobalReducer.actions.push({
		field: 'contracts',
		param: name,
		value: { abi, id },
	}));
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
	const abi = JSON.parse(localStorage.getItem('contracts'))[accountId][contractId];

	if (isConst) {
		let constants = abi.filter((value) =>
			value.constant && value.name && !value.inputs.length);

		constants = constants.map(async (constant) => {
			const method = formatSignature(constant);
			const constantValue =
				await getContractConstant(instance, accountId, contractId, method);
			return Object.defineProperty(constant, 'constantValue', {
				value: constantValue,
				writable: true,
				enumerable: true,
				configurable: true,
			});
		});

		await Promise.all(constants);
	} else {
		abi.filter((value) => !value.constant && value.name && value.type === 'function');
	}
};

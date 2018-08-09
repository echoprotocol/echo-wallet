import { Map } from 'immutable';

import {
	getContractId,
	getContract,
	getContractConstant,
	formatSignature,
} from '../api/ContractApi';

import { setError, setParamError, closeModal } from './ModalActions';

import GlobalReducer from '../reducers/GlobalReducer';
import { FORM_CREATE_CONTRACT } from '../constants/FormConstants';

import { getMethod } from '../helpers/ContractHelper';

import { MODAL_WATCH_LIST } from '../constants/ModalConstants';

export const loadContracts = (accountId) => (dispatch) => {
	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) { return; }

	dispatch(GlobalReducer.actions.set({
		field: 'contracts',
		value: new Map(contracts[accountId]),
	}));
};

export const addContract = (address, abi) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);

	try {
		const contractId = `1.16.${getContractId(address)}`;

		const contract = await getContract(instance, contractId);

		if (!contract) {
			dispatch(setParamError(MODAL_WATCH_LIST, 'address', 'Invalid contract address'));
			return;
		}

		let contracts = localStorage.getItem('contracts');

		contracts = contracts ? JSON.parse(contracts) : {};

		if (!contracts[accountId]) {
			contracts[accountId] = {};
		}

		contracts[accountId][address] = abi;
		localStorage.setItem('contracts', JSON.stringify(contracts));

		dispatch(GlobalReducer.actions.push({
			field: 'contracts',
			param: address,
			value: abi,
		}));

		dispatch(closeModal(MODAL_WATCH_LIST));
	} catch (err) {
		dispatch(setError(MODAL_WATCH_LIST, 'error', err));
	}
};

export const addContractByName = (contractId) => (dispatch, getState) => {
	const accountId = getState()
		.global
		.getIn(['activeUser', 'id']);

	const name = getState()
		.form
		.getIn([FORM_CREATE_CONTRACT, 'name']).value;
	const abi = getState()
		.form
		.getIn([FORM_CREATE_CONTRACT, 'abi']).value;

	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	contracts[accountId][name] = {
		abi,
		contractId,
	};
	localStorage.setItem('contracts', JSON.stringify(contracts));

	dispatch(GlobalReducer.actions.push({
		field: 'contracts',
		param: name,
		value: { abi, contractId },
	}));

	dispatch(closeModal(MODAL_WATCH_LIST));
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

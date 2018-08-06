import { List, Map } from 'immutable';

import {
	getContractId,
	getContract, getContractConstant,
} from '../api/ContractApi';

import { setError, setParamError, closeModal } from './ModalActions';
import { setValue } from './FormActions';

import GlobalReducer from '../reducers/GlobalReducer';

import { formatSignature, getMethod } from '../helpers/AbiHelper';

import { FORM_CONTRACT_CONSTANT, FORM_CONTRACT_FUNCTION } from '../constants/FormConstants';
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


	const value =
		await getContractConstant(
			instance,
			accountId,
			contractId,
			getMethod(method, args),
		);

	dispatch(setValue(FORM_CONTRACT_CONSTANT, 'query', value));
};

export const formatAbi = (contractId, isConst) => async (dispatch, getState) => {

	const instance = getState().echojs.getIn(['system', 'instance']);

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const abi = localStorage.getItem('contracts')[accountId][contractId];

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

		constants = await Promise.all(constants);

		dispatch(setValue(FORM_CONTRACT_CONSTANT, 'constants', new List(constants)));
	} else {
		const functions = abi.filter((value) => !value.constant && value.name && value.type === 'function');

		dispatch(setValue(FORM_CONTRACT_FUNCTION, 'functions', new List(functions)));
	}
};

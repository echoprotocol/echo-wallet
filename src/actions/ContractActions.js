import { Map, List } from 'immutable';

import {
	getContractId,
	getContract,
	getContractConstant,
	formatSignature,
	getContractResult,
} from '../api/ContractApi';

import { setError, setParamError, closeModal } from './ModalActions';

import GlobalReducer from '../reducers/GlobalReducer';
import ContractReducer from '../reducers/ContractReducer';

import { getMethod } from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';

import { MODAL_WATCH_LIST } from '../constants/ModalConstants';

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

export const addContractByName = (
	contractResultId,
	accountId,
	name,
	abi,
) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);

	const address = (await getContractResult(instance, contractResultId)).exec_res.new_address;

	const contractId = `1.16.${getContractId(address)}`;

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

	const abi = erc20;
	// const abi = JSON.parse(localStorage.getItem('contracts'))[accountId][contractId];

	if (isConst) {
		let constants = abi.filter((value) =>
			value.constant && value.name && !value.inputs.length);

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

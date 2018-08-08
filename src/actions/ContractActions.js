import { Map } from 'immutable';

import {
	getContractId,
	getContract,
} from '../api/ContractApi';

import { MODAL_WATCH_LIST } from '../constants/ModalConstants';
import { setError, setParamError, closeModal } from './ModalActions';

import GlobalReducer from '../reducers/GlobalReducer';
import { FORM_CREATE_CONTRACT } from '../constants/FormConstants';

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

export const addContractByName = () => (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);

	const name = getState().form.getIn([FORM_CREATE_CONTRACT, 'name']).value;
	const abi = getState().form.getIn([FORM_CREATE_CONTRACT, 'abi']).value;

	let contracts = localStorage.getItem('contracts');

	contracts = contracts ? JSON.parse(contracts) : {};

	if (!contracts[accountId]) {
		contracts[accountId] = {};
	}

	contracts[accountId][name] = abi;
	localStorage.setItem('contracts', JSON.stringify(contracts));

	dispatch(GlobalReducer.actions.push({
		field: 'contracts',
		param: name,
		value: abi,
	}));

	dispatch(closeModal(MODAL_WATCH_LIST));
};

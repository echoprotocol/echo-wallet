import {
	getContractId,
	getContract,
} from '../api/ContractApi';

import { MODAL_WATCH_LIST } from '../constants/ModalConstants';
import { setParamError, closeModal } from './ModalActions';

import GlobalReducer from '../reducers/GlobalReducer';

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

		if (!contracts) {
			contracts = {};
			contracts[accountId] = {};
		}

		contracts[accountId][address] = abi;
		localStorage.setItem('contracts', contracts);

		dispatch(GlobalReducer.actions.setIn({
			field: 'contracts',
			value: { [address]: abi },
		}));

		dispatch(closeModal(MODAL_WATCH_LIST));
	} catch (err) {
		dispatch(setParamError(MODAL_WATCH_LIST, 'error', err));
	}
};

export default {};

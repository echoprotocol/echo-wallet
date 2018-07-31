import { List } from 'immutable';
import { setValue } from './FormActions';
import {
	FORM_CONTRACT_CONSTANT,
	FORM_CONTRACT_FUNCTION,
} from '../constants/FormConstants';

import { getContractConstant, getContractId, getAddress } from '../api/ContractApi';

import erc20abi from '../../config/erc20.abi.json';

const formatAbi = (contractId, isConst) => async (dispatch, getState) => {

	// const abi = getState().global.getIn(['activeUser', 'contracts', contractId]);
	const abi = erc20abi;
	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (isConst) {
		let constants = abi.filter((value) => value.constant && value.name);

		const instance = getState().echojs.getIn(['system', 'instance']);
		const address = (await getAddress(instance, '1.17.1')).exec_res.new_address;

		contractId = `1.16.${getContractId(address)}`;
		constants = constants.map(async (constant) => {
			const constantValue =
				await getContractConstant(instance, accountId, contractId, constant.name);
			return Object.defineProperty(constant, 'constantValue', {
				value: constantValue,
				writable: true,
				enumerable: true,
				configurable: true,
			});
		});
		dispatch(setValue(FORM_CONTRACT_CONSTANT, 'constants', new List(constants)));
	} else {
		const functions = abi.filter((value) => !value.constant && value.name);

		dispatch(setValue(FORM_CONTRACT_FUNCTION, 'functions', new List(functions)));
	}
};

export default formatAbi;

import { List } from 'immutable';
import { setValue } from './FormActions';
import {
	FORM_CONTRACT_CONSTANT,
	FORM_CONTRACT_FUNCTION,
} from '../constants/FormConstants';

import { getContractConstant, getContractId, getAddress } from '../api/ContractApi';

import { formatFullMethod, formatSignature } from '../helpers/AbiHelper';

import erc20abi from '../../config/erc20.abi.test1.json';


/**
 * parameters
 * method: {
 *     name,
 *     inputs: ARRAY: {
 *         type
 *     }
 * },
 * args: ARRAY,
 * options: {
 *     accountId,
 *     contractId,
 * },
 */

export const contractQuery = (method, args, options) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);
	const valueBalanceOf =
		await getContractConstant(
			instance,
			options.accountId,
			options.contractId,
			formatFullMethod(method, args),
		);
	dispatch(setValue(FORM_CONTRACT_CONSTANT, 'queue', valueBalanceOf));
};

export const formatAbi = (contractId, isConst) => async (dispatch, getState) => {

	const instance = getState().echojs.getIn(['system', 'instance']);
	const abi = erc20abi;

	const address = (await getAddress(instance, '1.17.0')).exec_res.new_address;
	contractId = `1.16.${getContractId(address)}`;

	const accountId = getState().global.getIn(['activeUser', 'id']);

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
		const functions = abi.filter((value) => !value.constant && value.name);

		dispatch(setValue(FORM_CONTRACT_FUNCTION, 'functions', new List(functions)));
	}
};

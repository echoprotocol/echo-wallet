import { List } from 'immutable';
import * as abiDecoder from 'abi-decoder';
import { setValue } from './FormActions';
import {
	FORM_CONTRACT_CONSTANT,
	FORM_CONTRACT_FUNCTION,
} from '../constants/FormConstants';

import { getContractConstant, getContractId, getAddress } from '../api/ContractApi';

import erc20abi from '../../config/erc20.abi.test1.json';

const formatAbi = (contractId, isConst) => async (dispatch, getState) => {

	// const abi = getState().global.getIn(['activeUser', 'contracts', contractId]);
	const abi = erc20abi;
	const newAbi = abiDecoder.addABI(abi);
	console.log(newAbi);
	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (isConst) {
		let constants = abi.filter((value) => value.constant && value.name);

		const instance = getState().echojs.getIn(['system', 'instance']);
		const address = (await getAddress(instance, '1.17.0')).exec_res.new_address;

		contractId = `1.16.${getContractId(address)}`;
		constants = constants.map(async (constant) => {
			console.log(accountId, contractId, constant.name);
			const constantValue =
				await getContractConstant(instance, accountId, contractId, constant.name);
			console.log(constantValue);
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

export default formatAbi;

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

	const instance = getState().echojs.getIn(['system', 'instance']);

	// const abi = getState().global.getIn(['activeUser', 'contracts', contractId]);
	abiDecoder.addABI(erc20abi);
	const newAbi = abiDecoder.getMethodIDs();

	const address = (await getAddress(instance, '1.17.0')).exec_res.new_address;

	contractId = `1.16.${getContractId(address)}`;

	const accountId = getState().global.getIn(['activeUser', 'id']);
	let accountNum = 22;
	accountNum = accountNum.toString(16);
	accountNum += '00000000000000000000000000000000000000';

	if (isConst) {
		let constants = Object.entries(newAbi).filter((value) =>
			value[1].constant && value[1].name && !value[1].inputs.length);
		let balanceOf = Object.entries(newAbi).filter((value) => value[1].constant && value[1].name === 'balanceOf')[0][0];
		balanceOf += `(${accountNum})`;
		const valueBalanceOf =
            await getContractConstant(instance, accountId, contractId, balanceOf);
		console.log(balanceOf, valueBalanceOf);

		constants = constants.map(async (constant) => {
			const constantValue =
				await getContractConstant(instance, accountId, contractId, constant[0]);
			console.log(constant[1].name, constant[0], constantValue);
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

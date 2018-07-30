import { List } from 'immutable';
import { setValue } from './FormActions';
import {
	FORM_CONTRACT_CONSTANT,
	FORM_CONTRACT_FUNCTION,
} from '../constants/FormConstants';

const formatAbi = (contractId, isConst) => async (dispatch, getState) => {
	/**
     *  Contracts structure
     *  contracts: {
	 *  	[contractId]: {
	 *  		[abi]
	 *  	}
	 *  }
     */
	const abi = getState().global.getIn(['activeUser', 'contracts', contractId]);

	if (isConst) {
		const constants = abi.filter((value) => value.constant && value.name);

		dispatch(setValue(FORM_CONTRACT_CONSTANT, 'constants', new List(constants)));
	} else {
		const functions = abi.filter((value) => !value.constant && value.name);

		dispatch(setValue(FORM_CONTRACT_FUNCTION, 'functions', new List(functions)));
	}
};

export default formatAbi;

/* eslint-disable import/prefer-default-export */
import operations from '../constants/Operations';
import { FORM_TRANSACTION_DETAILS } from '../constants/FormConstants';
import { setFormValue } from '../actions/FormActions';

const formatDetails = (options) => {
	const result = {};
	// TODO add fee
	switch (options.operation) {
		case operations.create_contract: {
			result.operation = {
				field: 'input',
				value: operations.create_contract,
			};
			result.from = {
				field: 'input',
				value: operations.registrar_account,
			};
			result.code = {
				field: 'area',
				value: operations.code,
			};
			result.asset_type = {
				field: 'input',
				value: operations.asset_type,
			};
			result.gas = {
				field: 'input',
				value: operations.gas,
			};
			result.gasPrice = {
				field: 'input',
				value: operations.gasPrice,
			};
			break;
		}
		default:
			return {};
	}

	result.operation = Object.keys(operations).find((i) => operations[i] === result.operation);

	return result;
};

export const setDetailsForm	= (details) => (dispatch) => {
	details = details.toJS();
	const options = { ...details.transaction, operation: details.operation };
	const formatOptions = formatDetails(options);
	Object.keys(formatOptions).forEach((op) => {
		dispatch(setFormValue(FORM_TRANSACTION_DETAILS, op, formatOptions[op]));
	});
};

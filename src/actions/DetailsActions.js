/* eslint-disable import/prefer-default-export */
import operations from '../constants/Operations';
import { FORM_TRANSACTION_DETAILS } from '../constants/FormConstants';
import { setFormValue } from '../actions/FormActions';

const formatDetails = (options) => {
	const result = {};
	// TODO add fee
	const operationNumber = operations[options.operation];
	switch (operationNumber) {
		case operations.create_contract: {
			result.operation = {
				field: 'input',
				data: options.create_contract,
			};
			result.from = {
				field: 'input',
				data: options.registrar_account,
			};
			result.code = {
				field: 'area',
				data: options.code,
			};
			result.asset_type = {
				field: 'input',
				data: options.asset_type,
			};
			result.gas = {
				field: 'input',
				data: options.gas,
			};
			result.gasPrice = {
				field: 'input',
				data: options.gasPrice,
			};
			break;
		}
		default:
			return {};
	}

	result.operation.data = Object.keys(operations).find((i) => operations[i] === operationNumber);

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

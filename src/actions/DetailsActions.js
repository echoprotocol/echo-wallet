/* eslint-disable import/prefer-default-export */
import operations from '../constants/Operations';
import { FORM_TRANSACTION_DETAILS } from '../constants/FormConstants';
import { setFormValue } from '../actions/FormActions';

const formatDetails = (options) => {
	const result = {};
	/*
		TODO add fee from Transaction Builder object or somewhere
		const tr = new TransactionBuilder();
		...
		await tr.set_required_fees()
 		const fee_asset = tr.operations[0][1].fee.asset_id
 		const fee_amount = tr.operations[0][1].fee.amount
	*/
	const operationNumber = operations[options.operation].value;
	switch (operationNumber) {
		case operations.contract.value: {
			result.operation = {
				field: 'input',
				data: operations.contract.name,
			};
			result.from = {
				field: 'input',
				data: options.registrar,
			};
			result.code = {
				field: 'area',
				data: options.code,
			};
			result.asset_id = {
				field: 'input',
				data: options.asset_id,
			};
			result.value = {
				field: 'input',
				data: options.value,
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
	return result;
};

export const setDetailsForm	= (details) => (dispatch) => {
	details = details.toJS();
	if (Object.keys(details.transaction) < 1) return;
	const options = { ...details.transaction, operation: details.operation };
	const formatOptions = formatDetails(options);
	Object.keys(formatOptions).forEach((op) => {
		dispatch(setFormValue(FORM_TRANSACTION_DETAILS, op, formatOptions[op]));
	});
};

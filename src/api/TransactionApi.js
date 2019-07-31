import { TransactionBuilder } from 'echojs-lib';

export const getOperationFee = async (type, options) => {
	const tr = new TransactionBuilder();

	tr.add_type_operation(type, options);

	await tr.set_required_fees(options.asset_id);

	return tr.operations[0][1].fee.amount; // eslint-disable-line no-underscore-dangle
};

import echo from 'echojs-lib';

export const getOperationFee = async (type, options) => {
	const tr = echo.createTransaction();

	tr.addOperation(type, options);

	await tr.setRequiredFees(options.asset_id);

	// TODO: check result
	return tr.operations[0][1].fee.amount; // eslint-disable-line no-underscore-dangle
};

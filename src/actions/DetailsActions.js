import operations from '../constants/Operations';

const formatDetails = (options) => async () => {
	const result = {};
	// TODO add fee
	switch (options.operation) {
		case operations.create_contract: {
			result.operation = operations.create_contract;
			result.from = options.registrar_account;
			result.code = options.code;
			result.asset_type = options.asset_type;
			result.gas = options.gas;
			result.gasPrice = options.gasPrice;
			result.gas = options.gas;
			break;
		}
		default:
			break;
	}

	result.operation = Object.keys(operations).find((i) => operations[i] === result.operation);

	return result;
};

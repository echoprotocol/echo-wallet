import operations from '../constants/Operations';

const AREA_FIELDS = ['code'];

export const getTransactionDetails = (operationType, options) => {
	const operation = operations[operationType];

	const result = Object.entries(options).reduce((obj, [name, value]) => {
		obj[name] = {
			data: JSON.stringify(value),
			field: AREA_FIELDS.includes(name) ? 'area' : 'input',
		};
		return obj;
	}, {
		operation: {
			field: 'input',
			data: JSON.stringify(operation.name),
		},
	});

	return result;
};

export default {};

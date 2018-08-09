import utf8 from 'utf8';

import operations from '../constants/Operations';
import { events } from '../constants/LogEventConstants';

const AREA_FIELDS = ['code', 'comment'];

export const getTransactionDetails = (operationType, showOptions) => {
	const operation = operations[operationType];

	const result = Object.entries(showOptions).reduce((obj, [name, value]) => {
		obj[name] = {
			data: value,
			field: AREA_FIELDS.includes(name) ? 'area' : 'input',
		};
		return obj;
	}, {
		operation: {
			field: 'input',
			data: operation.name,
		},
	});

	return result;
};

export const getContractId = (address) => parseInt(address.substr(-32), 16);

export const logParser = (log) => {
	if (!log || !log.length) return null;
	return log.map((l) => {
		const contractId = parseInt(l.address.slice(2), 16);
		const event = events[l.log[0]] || l.log[0];
		const params = l.log.slice(1);
		return { contractId, event, params };
	});
};

export const getLog = (result) => {
	const trReceipt = result.tr_receipt;
	return trReceipt ? trReceipt.log : null;
};

export const toUtf8 = (hex) => {
	let str = '';

	for (let i = 0; i < hex.length; i += 2) {
		const code = parseInt(hex.substr(i, 2), 16);
		if (code !== 0) {
			str += String.fromCharCode(code);
		}
	}
	return utf8.decode(str);
};

export const toInt = (hex) => parseInt(hex, 16);


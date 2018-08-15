import utf8 from 'utf8';
import accounting from 'accounting';

import operations from '../constants/Operations';
import { events } from '../constants/LogEventConstants';

const AREA_FIELDS = ['code', 'comment'];
const removeCamelCaseRegEx = /([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\\b)/g;
const removeSpaceRegEx = /\s\s+/g;
const removeUnderscoreRegEx = /_/g;

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

export const toHex = (str) => {
	let hex;
	let result = '';

	for (let i = 0; i < str.length; i += 1) {
		hex = str.charCodeAt(i).toString(16);
		result += hex;
	}

	return result;
};

export const convertContractConstant = (toType, fromType, constantValue) => {
	switch (toType) {
		case fromType: return null;
		case 'hex':
			if (fromType === 'number') {
				return {
					value: constantValue.toString(16),
					type: 'hex',
				};
			} else if (fromType === 'string') {
				return {
					value: toHex(constantValue),
					type: 'hex',
				};
			} else if (fromType === 'bool') {
				return {
					value: constantValue ? 1 : 0,
					type: 'hex',
				};
			}
			return {
				value: toHex(constantValue.toString()),
				type: 'hex',
			};
		case 'string':
			return {
				value: toUtf8(constantValue),
				type: 'string',
			};
		case 'number':
			if (fromType === 'bool') {
				return {
					value: constantValue ? 1 : 0,
					type: 'number',
				};
			}
			return {
				value: toInt(constantValue),
				type: 'number',
			};
		case 'bool':
			return {
				value: !!toInt(constantValue),
				type: 'number',
			};
		default: return null;
	}
};

export const formatAmount = (amount, precision, symbol) => accounting.formatMoney(amount / (10 ** precision), symbol, precision, ' ', '.', '%v %s');

export const formatCallContractField = (value) => String(value)
	.replace(removeUnderscoreRegEx, ' ')
	.split(removeCamelCaseRegEx)
	.join(' ')
	.trim()
	.replace(removeSpaceRegEx, ' ')
	.toLowerCase();

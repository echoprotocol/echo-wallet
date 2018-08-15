import utf8 from 'utf8';

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

const toFixed = (value, precision) => {
	const power = 10 ** precision;

	return (Math.round(value * power) / power).toFixed(precision);
};

export const formatAmount = (amount, precision, symbol) => {
	const number = Math.abs(amount / (10 ** precision));

	const base = `${parseInt(toFixed(Math.abs(number || 0), precision), 10)}`;
	const mod = base.length > 3 ? base.length % 3 : 0;

	let postfix = `.${toFixed(Math.abs(number), precision).split('.')[1]}`;

	for (let i = postfix.length - 1; i >= 0; i -= 1) {
		if (postfix[i] === '0') {
			postfix = postfix.substr(0, postfix.length - 1);
		} else if (postfix[i] === '.') {
			postfix = '';
		} else {
			break;
		}
	}

	const resultNumber = (mod ? `${base.substr(0, mod)} ` : '')
		+ base.substr(mod).replace(/(\d{3})(?=\d)/g, `$1${' '}`)
		+ (precision ? postfix : '');

	return symbol ? `${resultNumber} ${symbol}` : resultNumber;
};

export const formatCallContractField = (value) => String(value)
	.replace(removeUnderscoreRegEx, ' ')
	.split(removeCamelCaseRegEx)
	.join(' ')
	.trim()
	.replace(removeSpaceRegEx, ' ')
	.toLowerCase();

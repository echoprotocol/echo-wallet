import utf8 from 'utf8';
import BN from 'bignumber.js';

import operations from '../constants/Operations';
import { events } from '../constants/LogEventConstants';

BN.config({ EXPONENTIAL_AT: 1e+9 });
const AREA_FIELDS = ['code', 'note'];
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
	if (!log || !log.length) return [];
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
	let result = str;
	try {
		result = utf8.decode(str);
	} catch (error) {
		result = str;
	}
	return result;
};

export const toInt = (hex) => parseInt(hex, 16);
export const toIntBN = (hex) => new BN(hex, 16).toString();
export const toID = (hex) => {
	const isContract = !!toInt(hex.slice(0, 26), 16);
	return `1.${isContract ? 16 : 2}.${new BN(hex.substr(26), 16)}`;
};

export const converter = (toType, constantValue) => {
	switch (toType) {
		case 'id': return toID(constantValue);
		case 'number': return toIntBN(constantValue);
		case 'string': return toUtf8(constantValue);
		case 'bool': return (!!toInt(constantValue)).toString();
		default: return null;
	}
};

export const toFixed = (value, precision) => {
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


export const parseBytecode = (bytecode) => {
	const methodHash = bytecode.substr(0, 8);
	const argsString = bytecode.substr(8);

	const args = [];

	for (let i = 0; i < argsString.length / 64; i += 1) {
		args[i] = argsString.substr(64 * i, 64);
	}

	return {
		methodHash,
		args,
	};
};

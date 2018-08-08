import { keccak256 } from 'js-sha3';
import utf8 from 'utf8';

//	TODO methods should be in echojs-lib!!!
//	please, don't export them and use only as private methods at contract api
const getContractProp = (instance, contract, account, method) => instance.dbApi().exec(
	'call_contract_no_changing_state',
	[contract, account, '1.3.0', method],
);

const getContractInfo = (instance, contract) => instance.dbApi().exec('get_contract', [contract]);

const getHash = (str) => keccak256(str);

const fromUtf8 = (str, allowZero = true) => {
	str = utf8.encode(str);
	let hex = '';

	for (let i = 0; i < str.length; i += 1) {
		const code = str.charCodeAt(i);
		if (code === 0) {
			if (allowZero) {
				hex += '00';
			} else {
				break;
			}
		} else {
			const n = code.toString(16);
			hex += n.length < 2 ? `0${n}` : n;
		}
	}

	return hex;
};

const toUtf8 = (hex) => {
	let str = '';

	for (let i = 0; i < hex.length; i += 2) {
		const code = parseInt(hex.substr(i, 2), 16);
		if (code === 0) break;
		str += String.fromCharCode(code);
	}

	return utf8.decode(str);
};

const addressFromAccountId = (id) => {
	const prefix = id.split('.').splice(0, 2).join('.');

	if (prefix !== '1.2') {
		throw new Error('Unknown id type');
	}

	const hex = fromUtf8(id.split('.')[2]);

	return Array(64 - hex.length).fill(0).join('').concat(hex);
};

//	end

export const getContractId = (address) => parseInt(address.substr(-32), 16);

export const getTransferTokenCode = (from, to, amount) => {
	const fromAddress = addressFromAccountId(from);
	const toAddress = addressFromAccountId(to);
	amount = String(amount);
	const amountHex = Array(64 - amount.length).fill(0).join('').concat(amount);
	const methodId = getHash('transferFrom(address,address,uint256)').substr(0, 8);

	return `${methodId}${fromAddress}${toAddress}${amountHex}`;
};

export const getTokenBalance = async (instance, accountId, contractId) => {
	const accountAddress = addressFromAccountId(accountId);

	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		getHash('balanceOf(address)').substr(0, 8).concat(accountAddress),
	);

	return parseInt(result, 16);
};

export const getTokenSymbol = async (instance, accountId, contractId) => {
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		getHash('symbol()').substr(0, 8),
	);

	return toUtf8(result.substr(-64));
};

export const getTokenPrecision = async (instance, accountId, contractId) => {
	const result = await getContractProp(
		instance,
		contractId,
		accountId,
		getHash('decimals()').substr(0, 8),
	);

	return parseInt(result, 16);
};

export const getContractConstant = (instance, accountId, contractId, method) => getContractProp(
	instance,
	contractId,
	accountId,
	method,
);

export const getContract = (instance, contractId) => getContractInfo(instance, contractId);

export const formatSignature = (constant) => getHash(`${constant.name}(${constant.inputs.map((input) => input.type).join(',')})`).substr(0, 8);

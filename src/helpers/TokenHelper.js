/* eslint-disable import/prefer-default-export */
import operations from '../constants/Operations';

import { getLog, logParser } from './LogHelper';

export const checkBlockTransaction = (accountId, op, tokens) => {
	const operation = op[0];
	if (operation !== operations.contract.value) return false;

	const contractId = op[1].receiver;
	if (!contractId) return false;

	const token = tokens.find((t) => (t.contractId === contractId));

	if (!token) return false;
	const registar = op[1].registrar;

	if (registar && (registar === accountId)) {
        console.log(registar, accountId)
		return true;
	}

	return false;
};

export const checkTransactionResult = (accountId, result) => {
	console.log(1111)
	const log = getLog(result);
    console.log(555)
	if (!log) return false;
    console.log(666)
	const accountIdNumber = Number(accountId.split('.')[2]);
    console.log(777)
	return logParser(log).some((e) => {
        console.log(888)
		if (e.event === 'transfer') {
            console.log(999)
			return e.params.map((p) => parseInt(p, 16)).includes(accountIdNumber);
		}
        console.log('000')
		return false;
	});
};

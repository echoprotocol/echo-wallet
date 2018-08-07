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

	return (registar && (registar === accountId));
};

export const checkTransactionResult = (accountId, result) => {
	const log = getLog(result);
	if (!log) return false;
	const accountIdNumber = Number(accountId.split('.')[2]);
	return logParser(log).some((e) => {
		if (e.event === 'transfer') {
			return e.params.map((p) => parseInt(p, 16)).includes(accountIdNumber);
		}
		return false;
	});
};

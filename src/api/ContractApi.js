import BN from 'bignumber.js';
import echo from 'echojs-lib';

import { getMethod } from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';


export const getTokenBalance = async (accountId, contractId) => {
	const method = { name: 'balanceOf', inputs: [{ type: 'address' }] };
	const args = [accountId];
	const result = await echo.api.callContractNoChangingState(
		contractId,
		accountId,
		ECHO_ASSET_ID,
		getMethod(method, args),
	);

	return new BN(result, 16).toString(10);
};

export const getTokenSymbol = async (accountId, contractId) => {
	const method = { name: 'symbol', inputs: [] };
	const result = await echo.api.callContractNoChangingState(
		contractId,
		accountId,
		ECHO_ASSET_ID,
		getMethod(method),
	);

	return toUtf8(result.substr(-64));
};

export const getTokenPrecision = async (accountId, contractId) => {
	const method = { name: 'decimals', inputs: [] };
	const result = await echo.api.callContractNoChangingState(
		contractId,
		accountId,
		ECHO_ASSET_ID,
		getMethod(method),
	);

	return toInt(result);
};

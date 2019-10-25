import BN from 'bignumber.js';
import echo from 'echojs-lib';

import { getMethod } from '../helpers/ContractHelper';
import { toInt, toUtf8 } from '../helpers/FormatHelper';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

/**
 * @method getTokenBalance
 *
 * @param {String} accountId
 * @param {String} contractId
 * @returns {String}
 */
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

/**
 * @method getTokenSymbol
 *
 * @param {String} accountId
 * @param {String} contractId
 * @returns {String}
 */
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

/**
 * @method getTokenPrecision
 *
 * @param {String} accountId
 * @param {String} contractId
 * @returns {Number}
 */
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

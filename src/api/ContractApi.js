import BN from 'bignumber.js';
import echo from 'echojs-lib';

import Services from '../services';

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
	const result = await Services.getEcho().api.callContractNoChangingState(
		contractId,
		accountId,
		{ amount: 0, asset_id: ECHO_ASSET_ID },
		getMethod(method, args),
	);
	// const result = await echo.api.callContractNoChangingState(
	// 	contractId,
	// 	accountId,
	// 	{ amount: 0, asset_id: ECHO_ASSET_ID },
	// 	getMethod(method, args),
	// );

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
	const result = await Services.getEcho().api.callContractNoChangingState(
		contractId,
		accountId,
		{ amount: 0, asset_id: ECHO_ASSET_ID },
		getMethod(method),
	);
	// const result = await echo.api.callContractNoChangingState(
	// 	contractId,
	// 	accountId,
	// 	{ amount: 0, asset_id: ECHO_ASSET_ID },
	// 	getMethod(method),
	// );

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
	const result = await Services.getEcho().api.callContractNoChangingState(
		contractId,
		accountId,
		{ amount: 0, asset_id: ECHO_ASSET_ID },
		getMethod(method),
	);
	// const result = await echo.api.callContractNoChangingState(
	// 	contractId,
	// 	accountId,
	// 	{ amount: 0, asset_id: ECHO_ASSET_ID },
	// 	getMethod(method),
	// );

	return toInt(result);
};

/**
 * @method loadScript
 *
 * @param src
 * @returns {Promise<any>}
 */
export const loadScript = (src) => new Promise((resolve, reject) => {
	const findScript = [...document.scripts].find((script) => script.src === src);
	if (findScript) {
		return resolve();
	}
	const script = document.createElement('script');
	script.async = true;
	script.src = src;

	script.onerror = () => {
		reject(new Error(`Failed to load${src}`));
	};

	script.onload = () => {
		resolve();
	};

	if (window.Module) {
		window.Module = undefined;
	}

	document.getElementsByTagName('head')[0].appendChild(script);
	return null;
});

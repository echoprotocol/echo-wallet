import echo from 'echojs-lib';
import operations from '../constants/Operations';

/**
 * @method getOperationFee
 *
 * @param {String} type
 * @param {Object} options
 * @returns {Number}
 */
export const getOperationFee = async (type, options) => {
	const { value: operationId } = operations[type];

	console.log('getOperationFee', operationId);
	try {
		const [result] = await echo.api.getRequiredFees([[operationId, options]], options.asset_id);
		
	} catch (error) {
		console.log('resultresultresult', error);
	}
	const result = {};
	console.log('getOperationFee', result);

	switch (operationId) {
		case operations.transfer.value: return result.amount;
		case operations.contract_call.value: return result.fee.amount;
		default: {
			if (result.amount === null || result.amount === undefined) {
				/* eslint-disable no-console */
				console.debug('override fee access field from "getRequiredFees"', type, JSON.stringify(result, null, 2));
			}
			return result.amount;
		}
	}
};

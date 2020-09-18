import { constants, validators, OPERATIONS_IDS } from 'echojs-lib';
import _ from 'lodash';

import operations from '../constants/Operations';
import { VIEW_TRANSACTION_PATH } from '../constants/RouterConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';

import { formatError } from '../helpers/FormatHelper';

import { setValue, toggleLoading, setError } from './TableActions';
import { setField } from './TransactionActions';

import history from '../history';
import { CONTRACT_ID_PREFIX } from '../constants/GlobalConstants';
import { getSidechainTrxAsset } from '../helpers/ValidateHelper';
import Services from '../services';

/**
 * @method viewTransaction
 *
 * @param {Object} transaction
 * @returns {function(dispatch): Promise<undefined>}
 */
export const viewTransaction = (transaction) => async (dispatch) => {
	if ([operations.contract_create.name, operations.contract_call.name].includes(transaction.name)) {
		if (!Services.getEcho().isConnected) return;

		[, transaction.details] = await Services.getEcho().api.getContractResult(transaction.result);
		transaction.contract =
			(await Services.getEcho().api.getObject(transaction.result)).contracts_id;
	}

	dispatch(setField('details', transaction));

	history.push(VIEW_TRANSACTION_PATH);
};

const additionalFields = async (options, operation) => {
	if (!(options.subject && options.subject[0] &&
		!validators.isObjectId(_.get(operation, options.subject[0])))) {
		return null;
	}
	if (!validators.isObject(_.get(operation, options.value))) {
		return null;
	}
	const assetId = _.get(operation, options.value).asset_id;

	if (!validators.isObjectId(assetId)) {
		return null;
	}
	const { precision, symbol } = await Services.getEcho().api.getObject(assetId);

	return {
		..._.get(operation, options.value),
		precision,
		symbol,
	};
};

/**
 * @method formatOperation
 *
 * @param {Object} data
 * @returns {function(dispatch, getState): Promise<Object>}
 */
const formatOperation = (data) => async (dispatch, getState) => {
	const accountName = getState().global.getIn(['activeUser', 'name']);
	const [type, operation] = data.op;
	const block = await Services.getEcho().api.getBlock(data.block_num);
	const { name, options } = Object.values(operations).find((i) => i.value === type);

	const result = {
		id: data.id,
		timestamp: block.timestamp,
		block: data.block_num,
		name,
		value: {},
	};

	if (operation.fee) {
		const feeAsset = await Services.getEcho().api.getObject(operation.fee.asset_id);
		result.fee = {
			amount: operation.fee.amount,
			precision: feeAsset.precision,
			symbol: feeAsset.symbol,
		};
	}
	if (options.from) {
		const request = _.get(operation, options.from);
		const response = await Services.getEcho().api.getObject(request);
		result.from = { value: response.name, id: response.id };
	}

	if (options.subject) {
		if (options.subject[1]) {
			const request = _.get(operation, options.subject[0]);
			if (validators.isObjectId(request)) {
				const response = await Services.getEcho().api.getObject(request);
				result.subject = {
					value: response[options.subject[1]],
					id: response.id,
				};
			} else {
				result.subject = {
					value: operation[options.subject[0]] || '',
					id: null,
				};
			}
		} else {
			result.subject = {
				value: operation[options.subject[0]],
				id: options.subject[0] === 'name' ? '1.2.0' : null,
			};
		}
	}

	if (options.value) {
		if (validators.isUInt64(operation.amount)) {
			const coreAsset = await Services.getEcho().api.getObject(constants.CORE_ASSET_ID);
			result.value = {
				precision: coreAsset.precision,
				asset_id: coreAsset.id,
				symbol: coreAsset.symbol,
				amount: _.get(operation, options.value),
			};
		} else if (operation[options.value] instanceof Array) {
			const assetIds = operation[options.value].map((el) => el.asset_id);
			const assets = await Services.getEcho().api.getAssets(assetIds);
			result.value = operation[options.value].map((el, i) => ({
				...el,
				precision: assets[i].precision,
				symbol: assets[i].symbol,
			}));
		} else {
			result.value = {
				...result.value,
				amount: _.get(operation, options.value),
			};
			const addFields = await additionalFields(options, operation);
			if (addFields) {
				result.value = {
					...result.value,
					...addFields,
				};
			}
		}
		const sidechainAsset = getSidechainTrxAsset(type);
		result.value = result.value instanceof Array ? {
			assets: result.value,
			...sidechainAsset,
		} : {
			...result.value,
			...sidechainAsset,
		};
	}

	if (options.asset) {
		const request = _.get(operation, options.asset);
		const response = await Services.getEcho().api.getObject(request);
		result.value = {
			...result.value,
			precision: response.precision,
			symbol: response.symbol,
		};
	}

	if (type === operations.contract_create.value) {

		const [, resultId] = data.result;

		result.subject = { value: resultId };

		if (!Services.getEcho().isConnected) {
			return result;
		}

		const contractResult = await Services.getEcho().api.getContractResult(resultId);

		const [contractResultType, contractResultData] = contractResult;

		if (contractResultType === 0) {
			const { exec_res: { new_address: hexAddress } } = contractResultData;

			const id = `${CONTRACT_ID_PREFIX}.${parseInt(hexAddress.slice(2), 16)}`;
			result.subject = {
				value: id,
				id,
			};
		}
	}

	if ([operations.contract_create.value, operations.contract_call.value].includes(type)) {
		[, result.result] = data.result;
	}

	if (type === 0 && operation.memo && operation.memo.message) {
		result.memo = operation.memo;
	}

	result.color = result.from === accountName ? 'blue' : 'green';

	if (operation.code) {
		result.bytecode = operation.code;
	}

	return result;
};

/**
 * @method formatHistory
 *
 * @param {Array} activity
 * @returns {function(dispatch): Promise<undefined>}
 */
export const formatHistory = (activity) => async (dispatch) => {
	if (!activity.length) { return; }

	const DID_OPERATIONS = [
		OPERATIONS_IDS.DID_CREATE_OPERATION,
		OPERATIONS_IDS.DID_UPDATE_OPERATION,
		OPERATIONS_IDS.DID_DELETE_OPERATION,
	];
	const activityWithoutDIDOps = activity.filter((el) => !DID_OPERATIONS.includes(el.op[0]));
	try {
		let rows = activityWithoutDIDOps.map((h) => dispatch(formatOperation(h)));
		rows = await Promise.all(rows);
		dispatch(setValue(HISTORY_TABLE, 'data', rows));
	} catch (err) {
		dispatch(setError(HISTORY_TABLE, formatError(err)));
	} finally {
		dispatch(toggleLoading(HISTORY_TABLE, false));
	}
};

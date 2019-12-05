import echo, { constants, validators } from 'echojs-lib';
import _ from 'lodash';

import operations from '../constants/Operations';
import { VIEW_TRANSACTION_PATH } from '../constants/RouterConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';

import { formatError } from '../helpers/FormatHelper';

import { setValue, toggleLoading, setError } from './TableActions';
import { setField } from './TransactionActions';

import history from '../history';
import { CONTRACT_ID_PREFIX } from '../constants/GlobalConstants';

/**
 * @method viewTransaction
 *
 * @param {Object} transaction
 * @returns {function(dispatch): Promise<undefined>}
 */
export const viewTransaction = (transaction) => async (dispatch) => {
	if ([operations.contract_create.name, operations.contract_call.name].includes(transaction.name)) {
		if (!echo.isConnected) return;

		[, transaction.details] = await echo.api.getContractResult(transaction.result);
		transaction.contract = (await echo.api.getObject(transaction.result)).contracts_id;
	}

	dispatch(setField('details', transaction));

	history.push(VIEW_TRANSACTION_PATH);
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
	const block = await echo.api.getBlock(data.block_num);
	// console.log('block', block)
	// console.log('op', Object.values(operations))
	// console.log('type', type)
	// console.log('opFind', Object.values(operations).find((i) => i.value === type))
	const { name, options } = Object.values(operations).find((i) => i.value === type);
	// console.log('name')

	const result = {
		id: data.id,
		timestamp: block.timestamp,
		block: data.block_num,
		name,
		value: {},
	};

	try {
		if (block.round === 1160) console.log('gh', options)
		if (options.fee) {
			if (block.round === 1160 || block.round === 1927) console.log('fee1', options.fee)
			const feeAsset = await echo.api.getObject(operation.fee.asset_id);
			if (block.round === 1160 || block.round === 1927) console.log('fee2', feeAsset)
			result.fee = {
				amount: operation.fee.amount,
				precision: feeAsset.precision,
				symbol: feeAsset.symbol,
			};
			if (block.round === 1160 || block.round === 1927) console.log('fee3');
		}
		if (options.from) {
			const request = _.get(operation, options.from);
			if (block.round === 1160) console.log('form1')
			const response = await echo.api.getObject(request);
			if (block.round === 1160) console.log('form2')
			result.from = { value: response.name, id: response.id };
		}

		if (options.subject) {
			if (options.subject[1]) {
				const request = _.get(operation, options.subject[0]);
				if (block.round === 1160) {
					console.log(options)
					console.log('reqqqq', request)
					console.log('isreqqqq', validators.isObjectId(request))
					console.log('res1')
					console.log(operation)
					console.log(options.subject[0])
					console.log(options.subject)
				}
				if (validators.isObjectId(request)) {
					console.log('true')
					const response = await echo.api.getObject(request);
					if (block.round === 1160) console.log('res2')
					result.subject = {
						value: response[options.subject[1]],
						id: response.id,
					};
				} else {
					console.log('false', console.log(operation[options.subject[0]]))

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
				if (block.round === 1160) console.log('v1')

				const coreAsset = await echo.api.getObject(constants.CORE_ASSET_ID);
				if (block.round === 1160) console.log('vv2')

				result.value = {
					precision: coreAsset.precision,
					asset_id: coreAsset.id,
					symbol: coreAsset.symbol,
					amount: _.get(operation, options.value),
				};
			} else {
				result.value = {
					...result.value,
					amount: _.get(operation, options.value),
				};
			}
		}

		if (options.asset) {
			const request = _.get(operation, options.asset);
			if (block.round === 1160) console.log('req1')
			const response = await echo.api.getObject(request);
			if (block.round === 1160) console.log('req2')
			result.value = {
				...result.value,
				precision: response.precision,
				symbol: response.symbol,
			};
		}

		if (type === operations.contract_create.value) {

			const [, resultId] = data.result;

			result.subject = { value: resultId };

			if (!echo.isConnected) {
				return result;
			}
			if (block.round === 1160) console.log('contrREs1')
			const contractResult = await echo.api.getContractResult(resultId);
			if (block.round === 1160) console.log('contrREs2')

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
	} catch (e) {
		console.log(e.message)
		console.log('@$R#$#%@#$%#@%^@#%#$%@#%@#^#', block)
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
	console.log(activity)
	if (!activity.length) { return; }

	try {
		let rows = activity.map((h) => dispatch(formatOperation(h)));
		// const ress = [];
		// for (let i = 0; i < rows.length; i += 1) {
		// 	const res = await rows[i];
		// 	ress.push(res)
		// }
		// console.log(ress)
		rows = await Promise.all(rows);
		console.log(3)
		dispatch(setValue(HISTORY_TABLE, 'data', rows));
	} catch (err) {
		console.log(err.message)
		dispatch(setError(HISTORY_TABLE, formatError(err)));
	} finally {
		dispatch(toggleLoading(HISTORY_TABLE, false));
	}
};

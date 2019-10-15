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

export const viewTransaction = (transaction) => async (dispatch) => {
	if ([operations.contract_create.name, operations.contract_call.name].includes(transaction.name)) {
		if (!echo.isConnected) return;

		[, transaction.details] = await echo.api.getContractResult(transaction.result);
		transaction.contract = (await echo.api.getObject(transaction.result)).contracts_id;
	}

	dispatch(setField('details', transaction));

	history.push(VIEW_TRANSACTION_PATH);
};

const formatOperation = (data) => async (dispatch, getState) => {
	const accountName = getState().global.getIn(['activeUser', 'name']);
	const [type, operation] = data.op;
	const block = await echo.api.getBlock(data.block_num);
	const { name, options } = Object.values(operations).find((i) => i.value === type);

	const result = {
		id: data.id,
		timestamp: block.timestamp,
		block: data.block_num,
		name,
		value: {},
	};

	if (options.fee) {
		const feeAsset = await echo.api.getObject(operation.fee.asset_id);
		result.fee = {
			amount: operation.fee.amount,
			precision: feeAsset.precision,
			symbol: feeAsset.symbol,
		};
	}
	if (options.from) {
		const request = _.get(operation, options.from);
		const response = await echo.api.getObject(request);
		result.from = { value: response.name, id: response.id };
	}

	if (options.subject) {
		if (options.subject[1]) {
			const request = _.get(operation, options.subject[0]);
			const response = await echo.api.getObject(request);
			result.subject = {
				value: response[options.subject[1]],
				id: response.id,
			};
		} else {
			result.subject = {
				value: operation[options.subject[0]],
				id: options.subject[0] === 'name' ? '1.2.0' : null,
			};
		}
	}

	if (options.value) {
		if (validators.isUInt64(operation.amount)) {
			const coreAsset = await echo.api.getObject(constants.CORE_ASSET_ID);
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
		const response = await echo.api.getObject(request);
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

		const contractResult = await echo.api.getContractResult(resultId);

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

export const formatHistory = (activity) => async (dispatch) => {
	if (!activity.length) { return; }

	try {
		let rows = activity.map((h) => dispatch(formatOperation(h)));
		rows = await Promise.all(rows);
		dispatch(setValue(HISTORY_TABLE, 'data', rows));
	} catch (err) {
		dispatch(setError(HISTORY_TABLE, formatError(err)));
	} finally {
		dispatch(toggleLoading(HISTORY_TABLE, false));
	}
};

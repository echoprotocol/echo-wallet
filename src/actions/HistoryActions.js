import { EchoJSActions } from 'echojs-redux';
import _ from 'lodash';

import operations from '../constants/Operations';
import { VIEW_TRANSACTION_PATH } from '../constants/RouterConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';

import { formatError } from '../helpers/FormatHelper';

import { setValue, toggleLoading, setError } from './TableActions';
import { setField } from './TransactionActions';

import { getContractResult } from '../api/ContractApi';

import history from '../history';
import { CONTRACT_ID_PREFIX } from '../constants/GlobalConstants';

const fetch = (request) => async (dispatch) => {
	const response = await dispatch(EchoJSActions.fetch(request));
	return response;
};

export const viewTransaction = (transaction) => async (dispatch, getState) => {
	if ([operations.create_contract.name, operations.call_contract.name].includes(transaction.name)) {
		const instance = getState().echojs.getIn(['system', 'instance']);

		if (!instance) return;

		[, transaction.details] = await getContractResult(instance, transaction.result);
		transaction.contract = (await dispatch(fetch(transaction.result))).toJS().contracts_id;
	}

	dispatch(setField('details', transaction));

	history.push(VIEW_TRANSACTION_PATH);
};

const formatOperation = (data) => async (dispatch, getState) => {
	const accountName = getState().global.getIn(['activeUser', 'name']);
	const [type, operation] = data.op;
	const block = await dispatch(EchoJSActions.fetch(data.block_num));
	const feeAsset = (await dispatch(EchoJSActions.fetch(operation.fee.asset_id))).toJS();

	const { name, options } = Object.values(operations).find((i) => i.value === type);

	const result = {
		id: data.id,
		timestamp: block.timestamp,
		block: data.block_num,
		fee: {
			amount: operation.fee.amount,
			precision: feeAsset.precision,
			symbol: feeAsset.symbol,
		},
		name,
		value: {},
	};
	if (options.from) {
		const request = _.get(operation, options.from);
		const response = (await dispatch(fetch(request))).toJS();
		result.from = response.name;
	}

	if (options.subject) {
		if (options.subject[1]) {
			const request = _.get(operation, options.subject[0]);
			const response = (await dispatch(fetch(request))).toJS();
			result.subject = response[options.subject[1]];
		} else {
			result.subject = operation[options.subject[0]];
		}
	}

	if (options.value) {
		result.value = {
			...result.value,
			amount: _.get(operation, options.value),
		};
	}

	if (options.asset) {
		const request = _.get(operation, options.asset);
		const response = (await dispatch(fetch(request))).toJS();
		result.value = {
			...result.value,
			precision: response.precision,
			symbol: response.symbol,
		};
	}

	if (type === operations.create_contract.value) {

		const [, resultId] = data.result;

		result.subject = resultId;

		const instance = getState().echojs.getIn(['system', 'instance']);

		if (!instance) {
			return result;
		}

		const contractResult = await getContractResult(instance, resultId);

		const [contractResultType, contractResultData] = contractResult;

		if (contractResultType === 0) {
			const { exec_res: { new_address: hexAddress } } = contractResultData;

			result.subject = `${CONTRACT_ID_PREFIX}.${parseInt(hexAddress.slice(2), 16)}`;
		}
	}

	if ([operations.create_contract.value, operations.call_contract.value].includes(type)) {
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

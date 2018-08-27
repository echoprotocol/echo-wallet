import { EchoJSActions } from 'echojs-redux';
import _ from 'lodash';

import operations from '../constants/Operations';

import { VIEW_TRANSACTION_PATH } from '../constants/RouterConstants';
import { HISTORY_DATA } from '../constants/TableConstants';
import { MODAL_UNLOCK } from '../constants/ModalConstants';

import { setValue } from './TableActions';
import { openModal } from './ModalActions';
import { setNote } from './TransactionActions';

import { getContractResult } from '../api/ContractApi';

import history from '../history';

const fetch = (request) => async (dispatch) => {
	const response = await dispatch(EchoJSActions.fetch(request));
	return response;
};

export const viewTransaction = (transaction) => async (dispatch, getState) => {

	if (transaction.name === 'Contract') {
		const instance = getState().echojs.getIn(['system', 'instance']);

		if (!instance) return;

		transaction.details = await getContractResult(instance, transaction.subject);
		[transaction.contract] = (await dispatch(fetch(transaction.subject))).toJS().contracts_id;
	}

	history.push(VIEW_TRANSACTION_PATH, { data: transaction });
};

export const openUnlock = (note) => (dispatch) => {
	dispatch(openModal(MODAL_UNLOCK));
	dispatch(setNote({ note }));
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

	if (type === 47) {
		[, result.subject] = data.result;
	}

	if (type === 0 && operation.memo && operation.memo.message) {
		result.memo = operation.memo;
	}

	result.color = result.from === accountName ? 'yellow' : 'green';
	return result;
};

export const formatHistory = (activity) => async (dispatch) => {
	let rows = activity.map((h) => dispatch(formatOperation(h)));
	rows = await Promise.all(rows);
	dispatch(setValue(HISTORY_DATA, 'history', rows));
};

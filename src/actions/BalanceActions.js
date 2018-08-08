import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import {
	getContractResult,
	getTokenPrecision,
	getTokenBalance,
	getContract,
	getTokenSymbol,
} from '../api/ContractApi';

import { checkBlockTransaction, checkTransactionResult } from '../helpers/ContractHelper';

import { MODAL_TOKENS } from '../constants/ModalConstants';
import { setError, setParamError, closeModal } from './ModalActions';

import BalanceReducer from '../reducers/BalanceReducer';

export const getAssetsBalances = (assets) => async (dispatch) => {

	if (assets && Object.keys(assets).length) {
		let balances = Object.entries(assets).map(async (asset) => {
			const stats = (await dispatch(EchoJSActions.fetch(asset[1]))).toJS();
			asset = (await dispatch(EchoJSActions.fetch(asset[0]))).toJS();
			return { balance: stats.balance, ...asset };
		});
		balances = await Promise.all(balances);
		dispatch(BalanceReducer.actions.set({
			field: 'assets',
			value: new List(balances),
		}));
	}
};

export const getTokenBalances = (accountId) => async (dispatch, getState) => {

	/**
     *  Tokens structure
     *  tokens: {
	 *  	[accountId]: {
	 *  		[tokenSymbol]: [contractId]
	 *  	}
	 *  }
     */
	const instance = getState().echojs.getIn(['system', 'instance']);

	if (!instance) return;

	let tokens = localStorage.getItem('tokens');
	tokens = tokens ? JSON.parse(tokens) : {};

	if (tokens && tokens[accountId]) {
		let balances = tokens[accountId].map(async (contractId) => {
			const balance = await getTokenBalance(instance, accountId, contractId);
			const precision = await getTokenPrecision(instance, accountId, contractId);
			const symbol = await getTokenSymbol(instance, accountId, contractId);
			return {
				symbol, precision, balance, id: contractId,
			};
		});

		balances = await Promise.all(balances);

		dispatch(BalanceReducer.actions.set({
			field: 'tokens',
			value: new List(balances),
		}));
	}
};

export const updateTokenBalances = () => async (dispatch, getState) => {

	const tokens = getState().balance.get('tokens');
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const instance = getState().echojs.getIn(['system', 'instance']);

	if (!tokens.size || !accountId || !instance) return;
	let balances = tokens.map(async (value) => {
		const balance = await getTokenBalance(instance, accountId, value.id);
		return { ...value, balance };
	});

	balances = await Promise.all(balances);

	dispatch(BalanceReducer.actions.set({
		field: 'tokens',
		value: new List(balances),
	}));
};

export const initBalances = (accountId) => async (dispatch) => {

	await dispatch(getTokenBalances(accountId));

	const assets = (await dispatch(EchoJSActions.fetch(accountId))).toJS().balances;

	await dispatch(getAssetsBalances(assets));
};

export const addToken = (contractId) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);

	try {
		const contract = await getContract(instance, contractId);

		if (!contract) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Invalid contract id'));
			return;
		}

		const symbol = await getTokenSymbol(instance, accountId, contractId);
		const precision = await getTokenPrecision(instance, accountId, contractId);

		if (!symbol || !Number.isInteger(precision)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Invalid token contract'));
			return;
		}

		let tokens = localStorage.getItem('tokens');
		tokens = tokens ? JSON.parse(tokens) : {};

		if (!tokens[accountId]) {
			tokens[accountId] = [];
		}

		tokens[accountId].push(contractId);
		localStorage.setItem('tokens', JSON.stringify(tokens));

		const balance = await getTokenBalance(instance, accountId, contractId);

		dispatch(BalanceReducer.actions.push({
			field: 'tokens',
			value: {
				id: contractId, symbol, precision, balance,
			},
		}));

		dispatch(closeModal(MODAL_TOKENS));
	} catch (err) {
		dispatch(setError(MODAL_TOKENS, 'error', err));
	}

};

const checkTransactionLogs = async (r, instance, accountId) => {
	if (typeof r[1] === 'object') return false;

	const result = await getContractResult(instance, r[1]);

	return checkTransactionResult(accountId, result);
};

export const getObject = (subscribeObject) => async (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const instance = getState().echojs.getIn(['system', 'instance']);

	if (!accountId || !instance) return;
	switch (subscribeObject.type) {
		case 'block': {
			const tokens = getState().balance.get('tokens');
			const { transactions } = subscribeObject.value;
			if (!transactions || !tokens.size || !transactions.length) return;

			const isNeedUpdate = transactions.some((tr) =>
				tr.operations.some((op) => checkBlockTransaction(accountId, op, tokens)) ||
				tr.operation_results.some(async (r) => {
					const result = await checkTransactionLogs(r, instance, accountId);
					return result;
				}));
			if (isNeedUpdate) await dispatch(updateTokenBalances());
			break;
		}
		case 'accounts': {
			const subscribeAccountId = subscribeObject.value.get('id');

			if (subscribeAccountId !== accountId) return;

			const assets = getState().echojs.getIn(['data', 'accounts', accountId, 'balances']).toJS();
			if (!assets) return;
			dispatch(getAssetsBalances(assets));
			break;
		}
		default:
	}
};

export const removeToken = (contractId) => (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);

	let tokens = localStorage.getItem('tokens');
	tokens = tokens ? JSON.parse(tokens) : {};

	if (!tokens[accountId]) {
		tokens[accountId] = [];
	}

	tokens[accountId] = tokens[accountId].filter((i) => i !== contractId);
	localStorage.setItem('tokens', JSON.stringify(tokens));

	const index = getState().balance.get('tokens').findIndex((i) => i.id === contractId);
	dispatch(BalanceReducer.actions.delete({ field: 'tokens', value: index }));
};

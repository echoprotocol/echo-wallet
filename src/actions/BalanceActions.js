import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import {
	getTokenBalance,
	getTokenPrecision,
	getContract,
	getTokenSymbol,
} from '../api/ContractApi';

import { MODAL_TOKENS } from '../constants/ModalConstants';
import { setError, setParamError, closeModal } from './ModalActions';

import BalanceReducer from '../reducers/BalanceReducer';

export const initBalances = (accountId) => async (dispatch, getState) => {
	/**
	 *  Tokens structure
	 *  tokens: {
	 *  	[accountId]: {
	 *  		[tokenSymbol]: [contractId]
	 *  	}
	 *  }
	 */
	let tokens = localStorage.getItem('tokens');
	tokens = tokens ? JSON.parse(tokens) : {};

	const instance = getState().echojs.getIn(['system', 'instance']);

	if (tokens && tokens[accountId]) {
		let balances = tokens[accountId].map(async (contractId) => {
			const balance = await getTokenBalance(instance, accountId, contractId);
			const precision = await getTokenPrecision(instance, accountId, contractId);
			const symbol = await getTokenSymbol(instance, accountId, contractId);

			return {
				id: contractId, symbol, precision, balance,
			};
		});

		balances = await Promise.all(balances);

		dispatch(BalanceReducer.actions.set({
			field: 'tokens',
			value: new List(balances),
		}));
	}

	const assets = (await dispatch(EchoJSActions.fetch(accountId))).toJS().balances;

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

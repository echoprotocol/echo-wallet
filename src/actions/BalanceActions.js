import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import {
	getContractId,
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
		let balances = Object.entries(tokens[accountId]).map(async ([symbol, contractId]) => {
			const balance = await getTokenBalance(instance, accountId, contractId);
			const precision = await getTokenPrecision(instance, accountId, contractId);

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

export const addToken = (address) => async (dispatch, getState) => {
	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const contractId = `1.16.${getContractId(address)}`;

	try {
		const contract = await getContract(instance, contractId);

		if (!contract) {
			dispatch(setParamError(MODAL_TOKENS, 'address', 'Invalid contract address'));
			return;
		}

		const symbol = await getTokenSymbol(instance, accountId, contractId);

		if (!symbol) {
			dispatch(setParamError(MODAL_TOKENS, 'address', 'Invalid token contract'));
			return;
		}

		let tokens = localStorage.getItem('tokens');
		tokens = tokens ? JSON.parse(tokens) : {};

		if (!tokens[accountId]) {
			tokens[accountId] = {};
		}

		tokens[accountId][symbol] = contractId;
		localStorage.setItem('tokens', JSON.stringify(tokens));

		const balance = await getTokenBalance(instance, accountId, contractId);
		const precision = await getTokenPrecision(instance, accountId, contractId);

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

import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import {
	getContractId,
	getTokenBalance,
	getTokenContract,
	getTokenSymbol,
} from '../api/ContractApi';

import { MODAL_TOKENS } from '../constants/ModalConstants';
import { setParamValue, closeModal } from './ModalActions';

import BalanceReducer from '../reducers/BalanceReducer';

export const initBalances = (accountId) => async (dispatch) => {
	/**
	 *  Tokens structure
	 *  tokens: {
	 *  	[accountId]: {
	 *  		[tokenSymbol]: [contractId]
	 *  	}
	 *  }
	 */
	const tokens = localStorage.getItem('tokens');
	const assets = (await dispatch(EchoJSActions.fetch(accountId))).toJS().balances;
	console.log(1);

	// const contractResult = (await getContractConstant('1.17.43')).exec_res.new_address;
	// console.log(contractResult);
	// console.log(`1.17.${parseInt(contractResult, 16)}`);
	// const constant = await getConstant('1.17.43', accountId);
	// console.log(constant);

	if (tokens && tokens[accountId]) {
		let balances = Object.keys(tokens[accountId]).map(async (symbol) => {
			const balance = await getTokenBalance(accountId, tokens[accountId][symbol]);
			const precision = 18; // TODO get precision
			return { symbol, precision, balance };
		});

		balances = await Promise.all(balances);

		dispatch(BalanceReducer.actions.set({
			field: 'tokens',
			value: new List(balances),
		}));
	}

	if (Object.keys(assets).length) {
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
		const contract = await getTokenContract(instance, contractId);

		if (!contract) {
			dispatch(setParamValue(MODAL_TOKENS, 'error', 'Invalid contract address'));
			return;
		}

		const symbol = await getTokenSymbol(instance, accountId, contractId);

		if (!symbol) {
			dispatch(setParamValue(MODAL_TOKENS, 'error', 'Invalid token contract'));
			return;
		}

		let tokens = localStorage.getItem('tokens');

		if (!tokens) {
			tokens = {};
			tokens[accountId] = {};
		}

		tokens[accountId][symbol] = contractId;
		localStorage.setItem('tokens', tokens);

		const balance = await getTokenBalance(instance, accountId, contractId);
		const precision = 18; // TODO get precision
		dispatch(BalanceReducer.actions.setIn({
			field: 'tokens',
			value: { symbol, precision, balance },
		}));

		dispatch(closeModal(MODAL_TOKENS));
	} catch (err) {
		dispatch(setParamValue(MODAL_TOKENS, 'error', err));
	}

};

import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';
import BN from 'bignumber.js';

import {
	getContractResult,
	getTokenPrecision,
	getTokenBalance,
	getContract,
	getTokenSymbol,
} from '../api/ContractApi';

import {
	setError,
	setParamError,
	closeModal,
	setDisable,
} from './ModalActions';
import { setValue } from './FormActions';

import { checkBlockTransaction, checkTransactionResult } from '../helpers/ContractHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';
import { validateContractId } from '../helpers/ValidateHelper';

import { MODAL_TOKENS } from '../constants/ModalConstants';
import { FORM_TRANSFER } from '../constants/FormConstants';
import { TRANSFER_PATH } from '../constants/RouterConstants';

import BalanceReducer from '../reducers/BalanceReducer';

import history from '../history';

const diffBalanceChecker = (type, balances) => (dispatch, getState) => {
	const oldBalances = getState().balance.get(type).toJS();
	balances.map((nb) => {
		const oldBalance = oldBalances.find((ob) => ob.id === nb.id);
		if (!oldBalance) return null;
		let diff = new BN(nb.balance).minus(oldBalance.balance);
		if (diff.lte(0)) return null;
		diff = diff.dividedBy(new BN(10).pow(nb.precision));
		return toastSuccess(`You receive ${diff.toString()} ${type} of ${nb.symbol}`);
	});
};

export const getAssetsBalances = (assets, update = false) => async (dispatch) => {
	let balances = [];

	if (assets && Object.keys(assets).length) {
		balances = Object.entries(assets).map(async (asset) => {
			const stats = (await dispatch(EchoJSActions.fetch(asset[1]))).toJS();
			asset = (await dispatch(EchoJSActions.fetch(asset[0]))).toJS();
			return { balance: stats.balance, ...asset };
		});

		balances = await Promise.all(balances);
		if (update) {
			dispatch(diffBalanceChecker('assets', balances));
		}
	}

	dispatch(BalanceReducer.actions.set({
		field: 'assets',
		value: new List(balances),
	}));
};

export const getTokenBalances = (accountId, networkName) => async (dispatch, getState) => {

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

	let tokens = localStorage.getItem(`tokens_${networkName}`);
	tokens = tokens ? JSON.parse(tokens) : {};

	let balances = [];
	if (tokens && tokens[accountId]) {
		balances = tokens[accountId].map(async (contractId) => {
			const balance = await getTokenBalance(instance, accountId, contractId);
			const precision = await getTokenPrecision(instance, accountId, contractId);
			const symbol = await getTokenSymbol(instance, accountId, contractId);
			return {
				symbol, precision, balance, id: contractId,
			};
		});

		balances = await Promise.all(balances);
	}

	dispatch(BalanceReducer.actions.set({
		field: 'tokens',
		value: new List(balances),
	}));
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

	dispatch(diffBalanceChecker('tokens', balances));

	dispatch(BalanceReducer.actions.set({
		field: 'tokens',
		value: new List(balances),
	}));
};

export const getPreviewBalances = (networkName) => async (dispatch) => {
	/**
     *  Preview structure
     *  preview: [{
     *  	balance,
     *  	id,
     *  	name,
     *  	symbol,
     *  	precision,
     *  }]
     */

	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	const { symbol, precision } = (await dispatch(EchoJSActions.fetch('1.3.0'))).toJS();

	let balances = accounts.map(async ({ name }) => {
		const account = (await dispatch(EchoJSActions.fetch(name))).toJS();

		let stats = {};
		if (account && account.balances && account.balances['1.3.0']) {
			stats = (await dispatch(EchoJSActions.fetch(account.balances['1.3.0']))).toJS();
		}

		return {
			balance: stats.balance || 0, name, symbol, precision,
		};
	});

	balances = await Promise.all(balances);

	dispatch(BalanceReducer.actions.set({ field: 'preview', value: new List(balances) }));
};

export const initBalances = (accountId, networkName) => async (dispatch) => {
	await dispatch(getTokenBalances(accountId, networkName));

	const account = (await dispatch(EchoJSActions.fetch(accountId))).toJS();

	await dispatch(getAssetsBalances(account.balances));

	await dispatch(getPreviewBalances(networkName));
};

export const addToken = (contractId) => async (dispatch, getState) => {

	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	dispatch(setDisable(MODAL_TOKENS, true));

	try {
		if (!contractId) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Contract id should not be empty'));
			return;
		}

		if (validateContractId(contractId)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Invalid contract id'));
			return;
		}

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

		let tokens = localStorage.getItem(`tokens_${networkName}`);
		tokens = tokens ? JSON.parse(tokens) : {};

		if (!tokens[accountId]) {
			tokens[accountId] = [];
		}

		if (tokens[accountId].includes(contractId)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Token already exists'));
			return;
		}

		tokens[accountId].push(contractId);
		localStorage.setItem(`tokens_${networkName}`, JSON.stringify(tokens));

		const balance = await getTokenBalance(instance, accountId, contractId);

		dispatch(BalanceReducer.actions.push({
			field: 'tokens',
			value: {
				id: contractId, symbol, precision, balance,
			},
		}));

		dispatch(closeModal(MODAL_TOKENS));
		toastSuccess('Token was successfully added');
	} catch (err) {
		dispatch(setError(MODAL_TOKENS, 'error', err));
	} finally {
		dispatch(setDisable(MODAL_TOKENS, false));
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
		case 'objects': {
			const objectId = subscribeObject.value.get('id');
			const balances = getState().echojs.getIn(['data', 'accounts', accountId, 'balances']);

			if (!balances) { return; }

			if (!Object.values(balances.toJS()).includes(objectId)) { return; }

			dispatch(getAssetsBalances(balances.toJS(), true));
			break;
		}
		default:
	}
};

export const removeToken = (contractId) => (dispatch, getState) => {
	const targetToken = getState().balance.get('tokens').find((t) => t.id === contractId);
	if (!targetToken || !targetToken.disabled) return;

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	let tokens = localStorage.getItem(`tokens_${networkName}`);
	tokens = tokens ? JSON.parse(tokens) : {};

	if (!tokens[accountId]) {
		tokens[accountId] = [];
	}

	tokens[accountId] = tokens[accountId].filter((i) => i !== contractId);
	localStorage.setItem(`tokens_${networkName}`, JSON.stringify(tokens));

	const index = getState().balance.get('tokens').findIndex((i) => i.id === contractId);
	dispatch(BalanceReducer.actions.delete({ field: 'tokens', value: index }));
};

export const enableToken = (contractId) => (dispatch) => {
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: false } }));
};

export const disableToken = (name, contractId) => (dispatch) => {
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: true } }));

	toastInfo(
		`You have removed ${name} from watch list`,
		() => dispatch(enableToken(contractId)),
		() => setTimeout(() => dispatch(removeToken(contractId)), 1000),
	);
};

export const redirectToTransfer = (asset, type) => (dispatch, getState) => {
	const currency = getState().form.getIn([FORM_TRANSFER, 'currency']);
	dispatch(setValue(FORM_TRANSFER, 'currency', { ...currency, ...asset, type }));
	dispatch(setValue(FORM_TRANSFER, 'selectedSymbol', asset.symbol));
	history.push(TRANSFER_PATH);
};

export const resetBalance = () => (dispatch) => {
	dispatch(BalanceReducer.actions.reset());
};

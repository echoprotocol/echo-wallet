import { List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';
import BN from 'bignumber.js';

import {
	getTokenPrecision,
	getTokenBalance,
	getContract,
	getTokenSymbol,
} from '../api/ContractApi';

import {
	setError,
	setParamError,
	closeModal,
	toggleLoading,
} from './ModalActions';
import { setValue, setFormError } from './FormActions';

import { formatError } from '../helpers/FormatHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';
import { checkErc20Contract, validateContractId } from '../helpers/ValidateHelper';

import { MODAL_TOKENS } from '../constants/ModalConstants';
import { FORM_TRANSFER } from '../constants/FormConstants';
import { INDEX_PATH } from '../constants/RouterConstants';
import { ECHO_ASSET_ID, TIME_REMOVE_CONTRACT } from '../constants/GlobalConstants';

import BalanceReducer from '../reducers/BalanceReducer';

import history from '../history';
import echo, { CACHE_MAPS, validators } from 'echojs-lib';

BN.config({ EXPONENTIAL_AT: 1e+9 });

const diffBalanceChecker = (type, balances) => (dispatch, getState) => {
	const oldBalances = getState().balance.get(type).toJS();
	balances.map((nb) => {
		const oldBalance = oldBalances.find((ob) => ob.id === nb.id);

		let diff = new BN(nb.balance).minus(oldBalance ? oldBalance.balance : '0');
		diff = diff.dividedBy(new BN(10).pow(nb.precision));

		if (!oldBalance) {
			return toastSuccess(`You receive ${diff.toString()} ${type} of ${nb.symbol}`);
		}

		if (diff.lte(0)) {
			return null;
		}

		return toastSuccess(`You receive ${diff.toString()} ${type} of ${nb.symbol}`);
	});
};

export const getBalanceFromAssets = (assets) => async (dispatch) => {
	let balances = [];
	if (!Object.keys(assets).length) {
		const defaultAsset = await dispatch(EchoJSActions.fetch(ECHO_ASSET_ID));
		balances.push({
			balance: 0,
			id: defaultAsset.get('id'),
			symbol: defaultAsset.get('symbol'),
			precision: defaultAsset.get('precision'),
		});
	} else {
		balances = Object.entries(assets).map(async (asset) => {
			const stats = (await dispatch(EchoJSActions.fetch(asset[1]))).toJS();
			asset = (await dispatch(EchoJSActions.fetch(asset[0]))).toJS();
			return { balance: stats.balance, ...asset };
		});

		balances = await Promise.all(balances);
	}

	return balances;
};

export const getAssetsBalances = (assets, update = false) => async (dispatch) => {

	let balances = [];

	if (assets && Object.keys(assets).length) {

		balances = await dispatch(getBalanceFromAssets(assets));

		if (update) {
			dispatch(diffBalanceChecker('assets', balances));
		}
	}

	dispatch(BalanceReducer.actions.set({
		field: 'assets',
		value: new List(balances),
	}));
	dispatch(setValue(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
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
     *  	balance: {
	 *  		id,
	 *  		amount,
	 *  	 	symbol,
	 *  		precision,
     *  	},
     *  	name,
	 *      accountId,
     *  }]
     */

	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	const coreAsset = await dispatch(EchoJSActions.fetch('1.3.0'));

	const balances = accounts.map(async ({ name }) => {
		const account = await dispatch(EchoJSActions.fetch(name));

		const preview = {
			balance: {
				amount: 0,
				symbol: coreAsset.get('symbol'),
				precision: coreAsset.get('precision'),
			},
			name,
			accountId: account.get('id'),
		};

		if (account && account.get('balances') && account.getIn(['balances', '1.3.0'])) {
			const stats = await dispatch(EchoJSActions.fetch(account.getIn(['balances', '1.3.0'])));
			preview.balance.amount = stats.get('balance') || 0;
			preview.balance.id = account.getIn(['balances', '1.3.0']);
		}

		return preview;
	});

	dispatch(BalanceReducer.actions.set({ field: 'preview', value: new List(await Promise.all(balances)) }));
};

export const initBalances = (accountId, networkName) => async (dispatch) => {
	await dispatch(getTokenBalances(accountId, networkName));

	const account = (await dispatch(EchoJSActions.fetch(accountId))).toJS();

	await dispatch(getAssetsBalances(account.balances));

	await dispatch(getPreviewBalances(networkName));
};

/**
 *
 * @param {String} contractId
 * @returns {Function}
 */
export const addToken = (contractId) => async (dispatch, getState) => {

	const instance = getState().echojs.getIn(['system', 'instance']);
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	dispatch(toggleLoading(MODAL_TOKENS, true));

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

		const [, { code }] = contract;

		const isErc20Token = checkErc20Contract(code);

		if (!isErc20Token) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'Invalid token contract'));
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
		dispatch(setError(MODAL_TOKENS, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(MODAL_TOKENS, false));
	}

};

const getAccountFromTransferFrom = (balances) => async (dispatch, getState) => {
	const isIndexPath = history.location.pathname === INDEX_PATH;

	if (!isIndexPath) {
		return undefined;
	}

	const form = getState().form.getIn([FORM_TRANSFER]);
	const formName = form.get('from').value;
	const account = await echo.api.getAccountByName(formName);
	const isFormBalance = balances[form.get('currency').id];

	if (!account || !isFormBalance) {
		return undefined;
	}

	return account;
};

export const handleSubscriber = (subscribeObjects = []) => async (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (!accountId || !echo.isConnected) return;

	const balances = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, accountId, 'balances']).toJS();
	const tokens = getState().balance.get('tokens').toJS();

	let isBalanceUpdated = balances.length !== getState().balance.get('assets').size;
	let isTokenUpdated = false;
	let isCurrentTransferBalanceUpdated = false;

	const accountFromTransfer = getAccountFromTransferFrom(balances);

	for (let i = 0; i < subscribeObjects.length; i += 1) {
		const object = subscribeObjects[i];

		if (!isBalanceUpdated && validators.isBalanceId(object.id)) {
			isBalanceUpdated = Object.values(balances).some((b) => b.id === object.id);
		}

		if (!isTokenUpdated && object.contract) {
			isTokenUpdated = Object.values(tokens).some((t) => t.id === object.contract);
		}

		if (
			!isCurrentTransferBalanceUpdated &&
			validators.isBalanceId(object.id) &&
			object.owner &&
			accountFromTransfer
		) {
			isCurrentTransferBalanceUpdated = Object.values(balances)
				.some((b) => b.id === object.id && accountFromTransfer.id === object.owner);
		}

		if (
			isTokenUpdated &&
			isBalanceUpdated &&
			(!accountFromTransfer || isCurrentTransferBalanceUpdated)
		) {
			break;
		}
	}

	if (isTokenUpdated) {
		await dispatch(updateTokenBalances());
	}

	if (balances && isBalanceUpdated) {
		await dispatch(getAssetsBalances(balances, true));
		const networkName = getState().global.getIn(['network', 'name']);
		await dispatch(getPreviewBalances(networkName));
	}

	if (isCurrentTransferBalanceUpdated) {
		const form = getState().form.getIn([FORM_TRANSFER]);
		const stats = await echo.api.getObject(balances[form.get('currency').id]);
		dispatch(setValue(FORM_TRANSFER, 'currency', { ...form.get('currency'), balance: stats.balance }));
		dispatch(setFormError(FORM_TRANSFER, 'amount', null));
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

export const enableToken = (contractId) => (dispatch, getState) => {
	const intervalId = getState().balance.get('intervalId');
	clearTimeout(intervalId);
	dispatch(BalanceReducer.actions.set({ field: 'intervalId', value: null }));
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: false } }));
};


export const disableToken = (name, contractId) => (dispatch) => {
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: true } }));

	toastInfo(
		`You have removed ${name} from watch list`,
		() => dispatch(enableToken(contractId)),
		() => {
			const intervalId = setTimeout(() => dispatch(removeToken(contractId)), TIME_REMOVE_CONTRACT);
			dispatch(BalanceReducer.actions.set({
				field: 'intervalId',
				value: intervalId,
			}));
		},
	);
};

export const setAsset = (asset, type) => (dispatch, getState) => {
	const currency = getState().form.getIn([FORM_TRANSFER, 'currency']);
	dispatch(setValue(FORM_TRANSFER, 'currency', { ...currency, ...asset, type }));
};

export const resetBalance = () => (dispatch) => {
	dispatch(BalanceReducer.actions.reset());
};

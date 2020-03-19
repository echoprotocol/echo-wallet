import { List } from 'immutable';
import BN from 'bignumber.js';
import { CACHE_MAPS, validators, OPERATIONS_IDS } from 'echojs-lib';

import Services from '../services';
import {
	getTokenPrecision,
	getTokenBalance,
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
import { toastSuccess, toastInfo, toastError } from '../helpers/ToastHelper';
import { checkErc20Contract } from '../helpers/ValidateHelper';

import { MODAL_TOKENS, MODAL_ERC20_TO_WATCH_LIST } from '../constants/ModalConstants';
import { FORM_TRANSFER, FORM_FREEZE } from '../constants/FormConstants';
import { INDEX_PATH, FROZEN_FUNDS_PATH } from '../constants/RouterConstants';
import { ECHO_ASSET_ID, TIME_REMOVE_CONTRACT, SIDECHAIN_ASSETS_SYMBOLS } from '../constants/GlobalConstants';

import BalanceReducer from '../reducers/BalanceReducer';

import history from '../history';
import GlobalReducer from '../reducers/GlobalReducer';
import { loadContracts } from './ContractActions';

BN.config({ EXPONENTIAL_AT: 1e+9 });

/**
 * @method diffBalanceChecker
 *
 * @param {String} type
 * @param {Array} balances
 * @@returns {function(dispatch, getState): {(Object | null)}}
 */
const diffBalanceChecker = (type, balances) => (dispatch, getState) => {
	const oldBalances = getState().balance.get(type).toJS();
	balances.map((nb) => {
		const oldBalance = oldBalances.find((ob) => ob.id === nb.id);

		let diff = new BN(nb.balance).minus(oldBalance ? oldBalance.balance : '0');
		diff = diff.dividedBy(new BN(10).pow(nb.precision));

		if (!oldBalance) {
			return toastSuccess([{
				text: '',
				postfix: 'toasts.success.receive.start',
			}, {
				text: `${diff.toString(10)} ${type}`,
				postfix: 'toasts.success.receive.of',
			}, {
				text: nb.symbol,
				postfix: '',
			}]);
		}

		if (diff.lte(0)) {
			return null;
		}

		return toastSuccess([{
			text: '',
			postfix: 'toasts.success.receive.start',
		}, {
			text: `${diff.toString(10)} ${type}`,
			postfix: 'toasts.success.receive.of',
		}, {
			text: nb.symbol,
			postfix: '',
		}]);
	});
};

/**
 * @method getBalanceFromAssets
 *
 * @param {Array} assets
 * @@returns {function(): Promise<Object>}
 */
export const getBalanceFromAssets = (assets) => async () => {
	let balances = [];
	if (!Object.keys(assets).length) {

		const defaultAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
		balances.push({
			balance: 0,
			id: defaultAsset.id,
			symbol: defaultAsset.symbol,
			precision: defaultAsset.precision,
		});
	} else {
		balances = Object.entries(assets).map(async (asset) => {

			const stats = await Services.getEcho().api.getObject(asset[1]);
			asset = await Services.getEcho().api.getObject(asset[0]);
			return { balance: stats.balance, ...asset };
		});

		balances = await Promise.all(balances);
	}

	return balances;
};

/**
 * @method getAssetsBalances
 *
 * @param {Array} assets
 * @param {Boolean} update
 * @returns {function(dispatch): Promise<undefined>}
 */
export const getAssetsBalances = (assets, update = false) => async (dispatch, getState) => {
	if (!assets) {
		const accountId = getState().global.getIn(['activeUser', 'id']);

		const [account] = await Services.getEcho().api.getFullAccounts([accountId]);

		assets = account.balances;
	}

	let balances = [];

	if (assets && Object.keys(assets).length) {

		balances = await dispatch(getBalanceFromAssets(assets));

		if (update) {
			dispatch(diffBalanceChecker('assets', balances));
		}
	}
	const sidechainAssetSymbols = Object.values(SIDECHAIN_ASSETS_SYMBOLS);
	const sidechainAssets = [];
	const echoAssets = balances.filter((b) => {
		let isSidechainAsset = false;
		if (sidechainAssetSymbols.some((a) => b.symbol === a.toUpperCase())) {
			b.notEmpty = true;
			sidechainAssets.push(b);
			isSidechainAsset = true;
		}
		return !isSidechainAsset;
	});
	if (sidechainAssets.length !== sidechainAssetSymbols.length) {
		for (let i = 0; i < sidechainAssetSymbols.length; i += 1) {
			if (!sidechainAssets.find((sa) => sa.symbol === sidechainAssetSymbols[i].toUpperCase())) {
				sidechainAssets.push({
					balance: 0,
					precision: 8,
					symbol: sidechainAssetSymbols[i].toUpperCase(),
					notEmpty: false,
				});
			}
		}
	}
	sidechainAssets.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
	dispatch(BalanceReducer.actions.set({ field: 'echoAssets', value: new List(echoAssets) }));
	dispatch(BalanceReducer.actions.set({ field: 'sidechainAssets', value: new List(sidechainAssets) }));
	dispatch(BalanceReducer.actions.set({ field: 'assets', value: new List(balances) }));
	dispatch(setValue(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
};

/**
 * @method getTokenBalances
 *
 * @param {String} accountId
 * @param {String} networkName
 * @@returns {function(dispatch): Promise<(undefined | Object)>}
 */
export const getTokenBalances = (accountId, networkName) => async (dispatch) => {

	/**
     *  Tokens structure
     *  tokens: {
	 *  	[accountId]: {
	 *  		[tokenSymbol]: [contractId]
	 *  	}
	 *  }
     */

	if (!Services.getEcho().isConnected) return;

	let tokens = localStorage.getItem(`tokens_${networkName}`);
	tokens = tokens ? JSON.parse(tokens) : {};

	let balances = [];
	if (tokens && tokens[accountId]) {
		balances = tokens[accountId].map(async (contractId) => {
			const balance = await getTokenBalance(accountId, contractId);
			const precision = await getTokenPrecision(accountId, contractId);
			const symbol = await getTokenSymbol(accountId, contractId);
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

/**
 * @method updateTokenBalances
 * @returns {function(dispatch, getState): Promise<(Object | undefined)>}
 */
export const updateTokenBalances = () => async (dispatch, getState) => {

	const tokens = getState().balance.get('tokens');
	const accountId = getState().global.getIn(['activeUser', 'id']);

	if (!tokens.size || !accountId || !Services.getEcho().isConnected) return;
	let balances = tokens.map(async (value) => {
		const balance = await getTokenBalance(accountId, value.id);
		return { ...value, balance };
	});

	balances = await Promise.all(balances);

	dispatch(diffBalanceChecker('tokens', balances));

	dispatch(BalanceReducer.actions.set({
		field: 'tokens',
		value: new List(balances),
	}));
};

/**
 * @method getPreviewBalances
 *
 * @param {String} networkName
 * @@returns {function(dispatch): Promise<(undefined | Object)>}
 */
export const getPreviewBalances = (networkName) => async (dispatch) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	const coreAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);

	const accountPromises = accounts.map(({ name }) => Services.getEcho().api.getAccountByName(name));
	const fetchedAccounts = await Promise.all(accountPromises);

	const accountIds = fetchedAccounts.map(({ id }) => id);

	const fullAccounts = await Services.getEcho().api.getFullAccounts(accountIds);

	const balances = fullAccounts.map(async (account) => {

		const preview = {
			balance: {
				amount: 0,
				symbol: coreAsset.symbol,
				precision: coreAsset.precision,
			},
			name: account.name,
			accountId: account.id,
		};

		if (account && account.balances && account.balances[ECHO_ASSET_ID]) {

			const stats = await Services.getEcho().api.getObject(account.balances[ECHO_ASSET_ID]);
			preview.balance.amount = stats.balance || 0;
			preview.balance.id = account.balances[ECHO_ASSET_ID];
		}

		return preview;
	});

	dispatch(BalanceReducer.actions.set({ field: 'preview', value: new List(await Promise.all(balances)) }));
};

/**
 * @method getFrozenBalances
 *
 * @param {String} accountId
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const getFrozenBalances = (accountId) => async (dispatch, getState) => {

	const frozenFunds = await Services.getEcho().api.getFrozenBalances(accountId);

	dispatch(BalanceReducer.actions.set({
		field: 'frozenFunds',
		value: new List(frozenFunds),
	}));
	const coreAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, ECHO_ASSET_ID]).toJS();

	const totalValueBN = frozenFunds
		.reduce((acc, { balance }) => acc.plus(balance.amount), new BN(0));
	const totalFrozenFunds = totalValueBN.div(10 ** coreAsset.precision).toString();

	dispatch(BalanceReducer.actions.set({
		field: 'totalFrozenFunds',
		value: totalFrozenFunds,
	}));
};

/**
 * @method initBalances
 *
 * @param {String} accountId
 * @param {String} networkName
 * @returns {function(dispatch): Promise<undefined>}
 */
export const initBalances = (accountId, networkName) => async (dispatch) => {

	await dispatch(getTokenBalances(accountId, networkName));

	const [account] = await Services.getEcho().api.getFullAccounts([accountId]);

	await dispatch(getAssetsBalances(account.balances));

	await dispatch(getPreviewBalances(networkName));

	await dispatch(getFrozenBalances(account.id));
};

/**
 * @method addToken
 *
 * @param {String} contractId
 * @@returns {function(dispatch, getState): Promise<undefined>}
 */
export const addToken = (contractId) => async (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	dispatch(toggleLoading(MODAL_TOKENS, true));

	try {
		if (!contractId) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.empty_contract_error'));
			return;
		}

		if (!validators.isContractId(contractId)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.invalid_id_error'));
			return;
		}

		const contract = await Services.getEcho().api.getContract(contractId);

		if (!contract) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.invalid_id_error'));
			return;
		}

		const [, { code }] = contract;

		const isErc20Token = checkErc20Contract(code);

		if (!isErc20Token) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.invalid_token_error'));
			return;
		}

		const symbol = await getTokenSymbol(accountId, contractId);
		const precision = await getTokenPrecision(accountId, contractId);

		if (!symbol || !Number.isInteger(precision)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.invalid_token_error'));
			return;
		}

		let tokens = localStorage.getItem(`tokens_${networkName}`);
		tokens = tokens ? JSON.parse(tokens) : {};

		if (!tokens[accountId]) {
			tokens[accountId] = [];
		}

		if (tokens[accountId].includes(contractId)) {
			dispatch(setParamError(MODAL_TOKENS, 'contractId', 'errors.contract_errors.token_already_exist_error'));
			return;
		}

		tokens[accountId].push(contractId);
		localStorage.setItem(`tokens_${networkName}`, JSON.stringify(tokens));

		const balance = await getTokenBalance(accountId, contractId);

		dispatch(BalanceReducer.actions.push({
			field: 'tokens',
			value: {
				id: contractId, symbol, precision, balance,
			},
		}));

		dispatch(closeModal(MODAL_TOKENS));
		toastSuccess([{
			text: '',
			postfix: 'toasts.success.token_was_added',
		}]);
	} catch (err) {
		dispatch(setError(MODAL_TOKENS, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(MODAL_TOKENS, false));
	}

};

/**
 * @method watchContractAsToken
 *
 * @param {String} contractId
 * @@returns {function(dispatch, getState): Promise<undefined>}
 */
export const watchContractAsToken = (contractId) => async (dispatch, getState) => {

	const accountId = getState().global.getIn(['activeUser', 'id']);
	const networkName = getState().global.getIn(['network', 'name']);

	try {
		const symbol = await getTokenSymbol(accountId, contractId);
		const precision = await getTokenPrecision(accountId, contractId);

		if (!symbol || !Number.isInteger(precision)) {
			dispatch(closeModal(MODAL_ERC20_TO_WATCH_LIST));
			toastError([{
				text: '',
				postfix: 'toasts.errors.token_invalid',
			}]);
			return;
		}

		let tokens = localStorage.getItem(`tokens_${networkName}`);
		tokens = tokens ? JSON.parse(tokens) : {};

		if (!tokens[accountId]) {
			tokens[accountId] = [];
		}

		if (tokens[accountId].includes(contractId)) {
			dispatch(closeModal(MODAL_ERC20_TO_WATCH_LIST));
			toastError([{
				text: '',
				postfix: 'toasts.errors.token_already_exists',
			}]);
			return;
		}

		tokens[accountId].push(contractId);
		localStorage.setItem(`tokens_${networkName}`, JSON.stringify(tokens));

		const balance = await getTokenBalance(accountId, contractId);

		dispatch(BalanceReducer.actions.push({
			field: 'tokens',
			value: {
				id: contractId, symbol, precision, balance,
			},
		}));

		dispatch(closeModal(MODAL_ERC20_TO_WATCH_LIST));
		toastSuccess([{
			text: '',
			postfix: 'toasts.success.token_was_added',
		}]);
	} catch (err) {
		dispatch(closeModal(MODAL_ERC20_TO_WATCH_LIST));
		toastError([{
			text: formatError(err),
			postfix: '',
		}]);
	}
};

/**
 * @method getAccountFromTransferFrom
 * @@returns {function(dispatch, getState): Promise<(Array | undefined)>}
 */
const getAccountFromTransferFrom = () => async (dispatch, getState) => {
	const isIndexPath = history.location.pathname === INDEX_PATH;

	if (!isIndexPath) {
		return undefined;
	}

	const form = getState().form.getIn([FORM_TRANSFER]);
	const formName = form.get('from').value;
	if (!formName) {
		return undefined;
	}

	const account = await Services.getEcho().api.getAccountByName(formName);
	if (!account) {
		return undefined;
	}

	const [fullAccount] = await Services.getEcho().api.getFullAccounts([account.id]);

	if (!fullAccount) {
		return undefined;
	}

	const isFormBalance = fullAccount.balances[form.get('currency').id];

	if (!isFormBalance) {
		return undefined;
	}

	return fullAccount;
};

/**
 * @method isUserOnFreezePage
 * @@returns {boolean}
 */
const isUserOnFreezePage = () => history.location.pathname === FROZEN_FUNDS_PATH;

/**
 * @method checkKeyWeightWarning
 *
 * @param {String} networkName
 * @param {String} accountId
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const checkKeyWeightWarning = (networkName, accountId, threshold) =>
	async (dispatch, getState) => {
		const account = getState().echojs.getIn(['fullAccounts', accountId]);
		const currentThreshold = threshold || account.getIn(['active', 'weight_threshold']);
		const auths = account.getIn(['active', 'account_auths']).concat(account.getIn(['active', 'key_auths']));

		let accounts = localStorage.getItem(`accounts_${networkName}`);
		accounts = accounts ? JSON.parse(accounts) : [];

		const fullKeys = accounts.reduce((resultKeys, acc) => {
			if (acc.name !== account.get('name')) {
				return resultKeys;
			}

			const filteredKeys = Object.keys(acc.addedKeys).filter((key) =>
				!resultKeys.includes(key) && acc.addedKeys[key].active);
			return resultKeys.concat(filteredKeys);
		}, []);

		const sumKeyWeight = fullKeys.reduce((resultWeight, key) => {
			const foundedKey = auths.find((auth) => auth.get(0) === key);
			return foundedKey ? resultWeight + foundedKey.get(1) : resultWeight;
		}, 0);

		return currentThreshold > sumKeyWeight;
	};

/**
 * @method handleSubscriber
 *
 * @param {Array} subscribeObjects
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const handleSubscriber = (subscribeObjects = []) => async (dispatch, getState) => {
	const accountId = getState().global.getIn(['activeUser', 'id']);
	if (!accountId || !Services.getEcho().isConnected) return;

	const balances = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, accountId, 'balances']).toJS();
	const tokens = getState().balance.get('tokens').toJS();
	const networkName = getState().global.getIn(['network', 'name']);

	let isBalanceUpdated = false;
	let isTokenUpdated = false;
	let isCurrentTransferBalanceUpdated = false;
	let isContractCalled = false;

	const accountFromTransfer = await dispatch(getAccountFromTransferFrom());

	const keyWeightWarn = await dispatch(checkKeyWeightWarning(networkName, accountId));
	dispatch(GlobalReducer.actions.set({ field: 'keyWeightWarn', value: keyWeightWarn }));

	for (let i = 0; i < subscribeObjects.length; i += 1) {
		const object = subscribeObjects[i];

		if (!isBalanceUpdated && validators.isAccountBalanceId(object.id)) {
			isBalanceUpdated = Object.values(balances).some((b) => b === object.id);
		}

		if (!isTokenUpdated && object.contract) {
			isTokenUpdated = Object.values(tokens).some((t) => t.id === object.contract);
		}

		if (!isContractCalled && object.op && object.op[0] === OPERATIONS_IDS.CONTRACT_CALL) {
			isContractCalled = true;
		}

		if (
			!isCurrentTransferBalanceUpdated &&
			validators.isAccountBalanceId(object.id) &&
			!!object.owner &&
			!!accountFromTransfer
		) {
			isCurrentTransferBalanceUpdated = Object.values(accountFromTransfer.balances)
				.some((b) => b === object.id && accountFromTransfer.id === object.owner);
		}

		if (
			isTokenUpdated &&
			isBalanceUpdated &&
			(!accountFromTransfer || isCurrentTransferBalanceUpdated)
		) {
			break;
		}
	}


	if (isContractCalled) {
		await dispatch(loadContracts(accountId, networkName));
	}
	if (isTokenUpdated) {
		await dispatch(updateTokenBalances());
	}

	if (balances && isBalanceUpdated) {
		await dispatch(getAssetsBalances(balances, true));
		await dispatch(getPreviewBalances(networkName));
		await dispatch(getFrozenBalances(accountId));
	}

	if (balances && isBalanceUpdated && isUserOnFreezePage()) {
		const form = getState().form.getIn([FORM_FREEZE]);
		const stats = await Services.getEcho().api.getObject(balances[form.get('currency').id]);
		dispatch(setValue(FORM_FREEZE, 'currency', { ...form.get('currency'), balance: stats.balance }));
	}

	if (isCurrentTransferBalanceUpdated) {
		const form = getState().form.getIn([FORM_TRANSFER]);

		const stats = await Services.getEcho().api.getObject(accountFromTransfer.balances[form.get('currency').id]);
		await dispatch(getAssetsBalances(accountFromTransfer.balances));
		dispatch(setValue(FORM_TRANSFER, 'currency', { ...form.get('currency'), balance: stats.balance }));
		dispatch(setFormError(FORM_TRANSFER, 'amount', null));
	}
};

/**
 * @method removeToken
 *
 * @param {String} contractId
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
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

/**
 * @method enableToken
 *
 * @param {String} contractId
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const enableToken = (contractId) => (dispatch, getState) => {
	const intervalId = getState().balance.get('intervalId');
	clearTimeout(intervalId);
	dispatch(BalanceReducer.actions.set({ field: 'intervalId', value: null }));
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: false } }));
};

/**
 * @method disableToken
 *
 * @param {String} name
 * @param {String} contractId
 * @returns {function(dispatch): Promise<undefined>}
 */
export const disableToken = (name, contractId) => (dispatch) => {
	dispatch(BalanceReducer.actions.update({ field: 'tokens', param: contractId, value: { disabled: true } }));

	toastInfo(
		[{
			text: '',
			postfix: 'toasts.info.remove_name.pt1',
		}, {
			text: name,
			postfix: 'toasts.info.remove_name.pt2',
		}],
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

/**
 * @method setAsset
 *
 * @param {Array} asset
 * @param {Array} type
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setAsset = (asset, type) => (dispatch, getState) => {
	dispatch(GlobalReducer.actions.set({ field: 'activePaymentTypeTab', value: 0 }));
	const currency = getState().form.getIn([FORM_TRANSFER, 'currency']);
	dispatch(setValue(FORM_TRANSFER, 'currency', { ...currency, ...asset, type }));
};

/**
 * @method resetBalance
 * @returns {function(dispatch): Promise<undefined>}
 */
export const resetBalance = () => (dispatch) => {
	dispatch(BalanceReducer.actions.reset());
};

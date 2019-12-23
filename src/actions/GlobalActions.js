import { Map, List } from 'immutable';
import { Echo } from 'echojs-lib';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import {
	SIGN_IN_PATH,
	INDEX_PATH,
	AUTH_ROUTES,
	CREATE_PASSWORD_PATH,
} from '../constants/RouterConstants';
import {
	MODAL_WIPE,
	MODAL_LOGOUT,
	MODAL_ACCEPT_INCOMING_CONNECTIONS,
} from '../constants/ModalConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';
import {
	ECHO_ASSET_ID,
	NETWORKS,
	USER_STORAGE_SCHEMES,
	GLOBAL_ERROR_TIMEOUT,
	DEFAULT_NETWORK,
} from '../constants/GlobalConstants';


import {
	validateNetworkName,
	validateNetworkAddress,
	validatePassword,
	isIpAddress,
	isUrlOrAddress,
} from '../helpers/ValidateHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';
import { formatError } from '../helpers/FormatHelper';

import {
	initBalances,
	handleSubscriber,
	resetBalance,
	getPreviewBalances,
	checkKeyWeightWarning,
} from './BalanceActions';
import { initSorts } from './SortActions';
import { loadContracts } from './ContractActions';
import { clearTable, formPermissionKeys } from './TableActions';
import { setFormError, clearForm, toggleLoading, setValue } from './FormActions';
import { closeModal, openModal, setError } from './ModalActions';

import Services from '../services';
import Listeners from '../services/Listeners';
import {
	FORM_ADD_CUSTOM_NETWORK,
	FORM_PASSWORD_CREATE,
	FORM_PERMISSION_KEY,
	FORM_SIGN_UP_OPTIONS,
	URI_TYPES,
} from '../constants/FormConstants';

export const incomingConnectionsRequest = () => (dispatch) => {
	let isFirst = localStorage.getItem('is_first_launch');
	const isAgreedWithNodeLaunch = localStorage.getItem('is_agreed_with_node_launch');

	isFirst = isFirst ? JSON.parse(isFirst) : true;

	if (isFirst) {
		dispatch(openModal(MODAL_ACCEPT_INCOMING_CONNECTIONS));
	}

	localStorage.setItem('is_first_launch', JSON.stringify(false));
};

/**
 * @method startLocalNode
 * @param pass
 * @returns {Function}
 */
export const startLocalNode = (pass) => (async (dispatch) => {

	const userStorage = Services.getUserStorage();
	const networkId = await userStorage.getNetworkId();

	let storageAccounts = localStorage.getItem(`accounts_${networkId}`);
	storageAccounts = storageAccounts ? JSON.parse(storageAccounts) : [];

	const accounts =
		await Promise.all(storageAccounts.map(({ name }) =>
			Services.getEcho().remote.api.getAccountByName(name)));
	if (pass) {
		await userStorage.setScheme(USER_STORAGE_SCHEMES.AUTO, pass);
	}

	const chainToken = await userStorage.getChainToken({ password: pass });

	const keyPromises = accounts.map((account) => new Promise(async (resolve) => {

		const keys = await userStorage.getAllWIFKeysForAccount(account.id, { password: pass });

		return resolve(keys.map((key) => ({
			id: account.id,
			key: key.wif,
		})));

	}));

	const accountsKeysResults = await Promise.all(keyPromises);
	const accountsKeys = [];

	accountsKeysResults.forEach((accountKeysArr) => {
		accountKeysArr.forEach((accountKey) => {
			accountsKeys.push(accountKey);
		});
	});

	Services.getEcho().setOptions(accountsKeys, networkId, chainToken);

	dispatch(GlobalReducer.actions.set({ field: 'isNodeSyncing', value: true }));
	dispatch(GlobalReducer.actions.set({ field: 'isNodePaused', value: false }));
});

/**
 * @method initAccount
 *
 * @param {String} accountName
 * @param {String} networkName
 * @returns {function(dispatch): Promise<undefined>}
 */
export const initAccount = (accountName, networkName) => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		let accounts = localStorage.getItem(`accounts_${networkName}`);

		accounts = accounts ? JSON.parse(accounts) : [];
		accounts = accounts.map((i) => {
			i.active = i.name === accountName;
			return i;
		});

		localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

		const echoInstance = Services.getEcho().getEchoInstance();
		if (echoInstance) {
			echoInstance.subscriber.setGlobalSubscribe((obj) => dispatch(handleSubscriber(obj)));
		}

		const { id, name, options } = await Services.getEcho().api.getAccountByName(accountName);

		await Services.getEcho().api.getFullAccounts([id, options.delegating_account]);

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			history.push(CREATE_PASSWORD_PATH);
		} else if (AUTH_ROUTES.includes(history.location.pathname)) {
			history.push(INDEX_PATH);
		}
		await dispatch(initBalances(id, networkName));
		dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));
		dispatch(initSorts(networkName));
		await dispatch(loadContracts(id, networkName));
		dispatch(clearForm(FORM_PERMISSION_KEY));

		const keyWeightWarn = await dispatch(checkKeyWeightWarning(networkName, id));
		dispatch(GlobalReducer.actions.set({ field: 'keyWeightWarn', value: keyWeightWarn }));

		dispatch(incomingConnectionsRequest());

	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(err) }));
	} finally {
		setTimeout(() => {
			dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
		}, 1000);
	}
};

/**
 * @method initAfterConnection
 * @param network
 * @returns {Function}
 */
export const initAfterConnection = (network) => async (dispatch) => {

	try {
		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();
		if (!doesDBExist) {
			history.push(CREATE_PASSWORD_PATH);
		}

		await Services.getEcho().api.getDynamicGlobalProperties(true);
		let accounts = localStorage.getItem(`accounts_${network.name}`);

		accounts = accounts ? JSON.parse(accounts) : [];

		await Services.getEcho().api.getObject(ECHO_ASSET_ID);

		if (!accounts.length) {
			if (!AUTH_ROUTES.includes(history.location.pathname) && doesDBExist) {
				history.push(SIGN_IN_PATH);
			}
		} else {
			const active = accounts.find((i) => i.active) || accounts[0];
			await dispatch(initAccount(active.name, network.name));
		}

		dispatch(GlobalReducer.actions.set({ field: 'inited', value: true }));


	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(err) }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};

/**
 *  @method initNetworks
 *
 * 	Set value to global reducer
 *
 * 	@param store
 * 	@return network
 */
export const initNetworks = (store) => async (dispatch) => {
	let current = localStorage.getItem('current_network');
	if (!current) {
		current = DEFAULT_NETWORK;
		localStorage.setItem('current_network', JSON.stringify(current));
	} else {
		current = JSON.parse(current);
	}

	dispatch(GlobalReducer.actions.set({
		field: 'network',
		value: new Map(current),
	}));

	let networks = localStorage.getItem('custom_networks');
	networks = networks ? JSON.parse(networks) : [];

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));

	try {
		await Services.getUserStorage().setNetworkId(current.name);
		if (store) {
			await Services.getEcho().init(current.name, { store });
		} else {
			await Services.getEcho().changeConnection(current.name);
		}
	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(err) }));
	}

	return current;
};

/**
 *  @method initApp
 *
 * 	Initialization application
 *
 * 	@param {Object?} store - redux store
 */
export const initApp = (store) => async (dispatch, getState) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	if (ELECTRON && window.ipcRenderer) {
		window.ipcRenderer.send('showWindow');
	}

	const listeners = new Listeners();
	listeners.initListeners(dispatch, getState);

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.init();

		const network = await dispatch(initNetworks(store));
		await dispatch(initAfterConnection(network));
	} catch (err) {
		console.warn(err.message || err);
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}

};

/**
 * @method disconnect
 * @returns {function(dispatch): Promise<undefined>}
 */
export const disconnection = () => async (dispatch) => {
	Services.getEcho().getEchoInstance().subscriber.reset();
	dispatch(clearTable(HISTORY_TABLE));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.disconnect());
};

export const customNodeConnect = async (url, apis) => {
	try {
		const tmpEcho = new Echo();
		await tmpEcho.connect(url, { apis });
		return tmpEcho;
	} catch (e) {
		return 'errors.node_errors.not_connect_error';
	}
};

/**
 * @method setGlobalError
 *
 * @param {String} err
 * @returns {function(dispatch): undefined}
 */
export const setGlobalError = (err) => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field: 'globalError', value: err }));

	setTimeout(() => {
		dispatch(GlobalReducer.actions.set({ field: 'globalError', value: null }));
	}, GLOBAL_ERROR_TIMEOUT);
};

/**
 * @method toggleBar
 *
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const toggleBar = (value) => (dispatch) => {
	dispatch(GlobalReducer.actions.toggleBar({ value }));
};

/**
 * @method push
 *
 * @param {String} field
 * @param {String} param
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const push = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.push({ field, param, value }));
};

/**
 * @method update
 *
 * @param {String} field
 * @param {String} param
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const update = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.update({ field, param, value }));
};

/**
 * @method remove
 *
 * @param {String} field
 * @param {String} param
 * @returns {function(dispatch): undefined}
 */
export const remove = (field, param) => (dispatch) => {
	dispatch(GlobalReducer.actions.remove({ field, param }));
};

/**
 * @method removeAccount
 *
 * @param {String} accountName
 * @param {String} password
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const removeAccount = (accountName, password) => async (dispatch, getState) => {
	const userStorage = Services.getUserStorage();
	await userStorage.setScheme(USER_STORAGE_SCHEMES.MANUAL, password);
	const correctPassword = await userStorage.isMasterPassword(password);

	if (!correctPassword) {
		dispatch(setError(MODAL_LOGOUT, 'errors.passowd_errors.invalid_password_error'));
		return;
	}

	const account = await Services.getEcho().api.getAccountByName(accountName);

	await userStorage.removeKeys(
		account.active.key_auths.map(([k]) => k),
		{ password, accountId: account.id },
	);

	const activeAccountName = getState().global.getIn(['activeUser', 'name']);
	const networkName = getState().global.getIn(['network', 'name']);

	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	accounts = accounts.filter(({ name }) => name !== accountName);
	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

	dispatch(closeModal(MODAL_LOGOUT));

	if (!accounts.length) {
		dispatch(clearTable(HISTORY_TABLE));
		dispatch(resetBalance());
		history.push(SIGN_IN_PATH);
		process.nextTick(() => dispatch(GlobalReducer.actions.logout()));

		Services.getEcho().getEchoInstance().subscriber.reset();
		Services.getEcho().getEchoInstance().cache.reset();
	}

	if (activeAccountName === accountName && accounts[0]) {
		dispatch(initAccount(accounts[0].name, networkName));
	} else {
		dispatch(getPreviewBalances(networkName));
	}

	dispatch(startLocalNode());
};

/**
 * @method isAccountAdded
 *
 * @param {String} accountName
 * @param {String} networkName
 * @returns {(String | null)}
 */
export const isAccountAdded = (accountName, networkName) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	if (accounts.find(({ name }) => name === accountName)) {
		return 'errors.account_errors.account_already_added_error';
	}

	return null;
};

export const addAccount = (accountName, networkName, addedWifsToPubKeys = []) => (dispatch) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);

	accounts = accounts ? JSON.parse(accounts) : [];

	const addedKeys = addedWifsToPubKeys.reduce((acc, key) => {
		const [publicKey, type] = key;
		acc[publicKey] = type;
		return acc;
	}, {});

	accounts.push({ name: accountName, active: false, addedKeys });

	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

	dispatch(clearTable(HISTORY_TABLE));
	dispatch(resetBalance());

	dispatch(initAccount(accountName, networkName));
	dispatch(incomingConnectionsRequest());
};

/**
 *
 * @param {String} accountName
 * @param {String} networkName
 * @param {String} publicKey
 * @param {String} type
 */
export const saveWifToStorage = (accountName, networkName, publicKey, type = 'active') => (dispatch) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	for (let accountKey = 0; accountKey < accounts.length; accountKey += 1) {
		const currentAccount = accounts[accountKey];
		if (currentAccount.name === accountName) {
			if (!currentAccount.addedKeys[publicKey]) {
				currentAccount.addedKeys[publicKey] = { active: false, echoRand: false };
			}

			currentAccount.addedKeys[publicKey][type] = true;
			break;
		}
	}

	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));
	dispatch(formPermissionKeys());
};

/**
 *
 * @param {String} accountName
 * @param {String} networkName
 * @returns {Object}
 */
export const getAvailableWifStatusesFromStorage = (accountName, networkName) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	const currentAccount = accounts.find(({ name }) => accountName === name);

	return (currentAccount && currentAccount.addedKeys) ? currentAccount.addedKeys : {};
};

export const updateStorage = (accountName, networkName, keys) => (dispatch) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	for (let accountKey = 0; accountKey < accounts.length; accountKey += 1) {
		const currentAccount = accounts[accountKey];
		if (currentAccount.name === accountName) {
			currentAccount.addedKeys = {};
			keys.forEach((key) => {
				const { publicKey, type } = key;

				if (!currentAccount.addedKeys[publicKey]) {
					currentAccount.addedKeys[publicKey] = { active: false, echoRand: false };
				}

				currentAccount.addedKeys[publicKey][type] = true;
			});
			break;
		}
	}

	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

	dispatch(formPermissionKeys());
};

/**
 * @method saveNetwork
 *
 * @param {Object} network
 * @returns {function(dispatch): Promise<undefined>}
 */
export const saveNetwork = (network) => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	await dispatch(disconnection());

	localStorage.setItem('current_network', JSON.stringify(network));
	await dispatch(initApp());

	const userStorage = Services.getUserStorage();
	await userStorage.setNetworkId(network.name);
};

/**
 * @method addNetwork
 * @returns {function(dispatch, getState): undefined}
 */
export const addNetwork = () => (dispatch, getState) => {
	const networks = getState().global.get('networks').toJS();
	const {
		address, name, autoswitch,
	} = getState().form.get(FORM_ADD_CUSTOM_NETWORK).toJS();

	const network = {
		url: address.value.trim(),
		name: name.value.trim(),
	};

	let nameError = validateNetworkName(network.name);

	if (NETWORKS.concat(networks).find((i) => i.name === network.name)) {
		nameError = 'errors.network_errors.network_already_exist_error';
	}

	if (nameError) {
		dispatch(setFormError(FORM_ADD_CUSTOM_NETWORK, 'name', nameError));
	}

	const addressError = validateNetworkAddress(network.url);

	if (addressError) {
		dispatch(setFormError(FORM_ADD_CUSTOM_NETWORK, 'address', addressError));
	}

	if (nameError || addressError) { return; }

	let customNetworks = localStorage.getItem('custom_networks');
	customNetworks = customNetworks ? JSON.parse(customNetworks) : [];
	customNetworks.push(network);

	localStorage.setItem('custom_networks', JSON.stringify(customNetworks));

	networks.push(network);

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));

	dispatch(clearForm(FORM_ADD_CUSTOM_NETWORK));

	if (autoswitch.value) { dispatch(saveNetwork(network)); }

	toastSuccess([{
		text: network.name,
		postfix: 'toasts.success.network_was_added',
	}]);

	history.goBack();
};

/**
 * @method enableNetwork
 *
 * @param {Object} network
 * @returns {function(dispatch, getState): undefined}
 */
export const enableNetwork = (network) => (dispatch, getState) => {
	let customNetworks = localStorage.getItem('custom_networks');
	customNetworks = customNetworks ? JSON.parse(customNetworks) : [];
	customNetworks.push(network);

	localStorage.setItem('custom_networks', JSON.stringify(customNetworks));

	const networks = getState().global.get('networks').toJS();
	networks.push(network);

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));

};

/**
 * @method deleteNetwork
 *
 * @param {Object} network
 * @returns {function(dispatch, getState): undefined}
 */
export const deleteNetwork = (network) => (dispatch, getState) => {
	let customNetworks = localStorage.getItem('custom_networks');
	customNetworks = customNetworks ? JSON.parse(customNetworks) : [];
	customNetworks = customNetworks.filter((i) => i.name !== network.name);

	localStorage.setItem('custom_networks', JSON.stringify(customNetworks));

	toastInfo(
		[{
			text: '',
			postfix: 'toasts.info.remove_id.pt1',
		}, {
			text: network.name,
			postfix: 'toasts.info.remove_id.pt2',
		}],
		() => dispatch(enableNetwork(network)),
		() => { },
	);

	const currentNetwork = getState().global.get('network').toJS();
	if (currentNetwork.name === network.name) {
		localStorage.removeItem('current_network');
		dispatch(initApp());
		return;
	}

	let networks = getState().global.get('networks').toJS();
	networks = networks.filter((i) => i.name !== network.name);

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));
};

/**
 * @method createDB
 *
 * @param {String} password
 * @returns {function(dispatch): Promise<undefined>}
 */
export const createDB = (password) => async (dispatch) => {
	const error = validatePassword(password);

	if (error) {
		dispatch(setValue(FORM_PASSWORD_CREATE, 'error', error));
		return;
	}

	dispatch(toggleLoading(FORM_PASSWORD_CREATE, true));

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.deleteDB(password);
		await userStorage.createDB(password);

		await userStorage.setScheme(USER_STORAGE_SCHEMES.MANUAL, password);

		history.push(SIGN_IN_PATH);
	} catch (err) {
		dispatch(setValue(FORM_PASSWORD_CREATE, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_PASSWORD_CREATE, false));
	}
};

/**
 * @method resetData
 * @returns {function(dispatch): Promise<undefined>}
 */
export const resetData = () => async (dispatch) => {
	dispatch(closeModal(MODAL_WIPE));

	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		Services.getEcho().getEchoInstance().subscriber.reset();
		Services.getEcho().getEchoInstance().cache.reset();

		dispatch(clearTable(HISTORY_TABLE));
		dispatch(resetBalance());
		process.nextTick(() => dispatch(GlobalReducer.actions.logout()));

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (doesDBExist) {
			await userStorage.deleteDB();
		}

		localStorage.clear();

		history.push(CREATE_PASSWORD_PATH);

	} catch (e) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(e) }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};


const saveRemoteAddressToLocalStorage = ({ address, network, account }) => {

	let accounts = localStorage.getItem(`accounts_${network}`);

	accounts = accounts ? JSON.parse(accounts) : [];

	const currentAccountStorage = accounts.find(({ name }) => name === account);

	if (!currentAccountStorage) {
		return;
	}

	const remoteAddresses = currentAccountStorage.addedRegistrationAddresses || [];

	const isAddressAlreadyAdded = remoteAddresses.find((a) => a.address === address);

	if (isAddressAlreadyAdded || !isUrlOrAddress(address)) {
		return;
	}

	const type = isIpAddress(address) ? URI_TYPES.IP : URI_TYPES.URL;

	remoteAddresses.push({ address, type });

	currentAccountStorage.addedRegistrationAddresses = remoteAddresses;

	localStorage.setItem(`accounts_${network}`, JSON.stringify(accounts));
};

const getRemoteAddressesFromLocalStorage = ({ network, account }) => {

	let accounts = localStorage.getItem(`accounts_${network}`);

	accounts = accounts ? JSON.parse(accounts) : [];

	const currentAccountStorage = accounts.find(({ name }) => name === account);

	if (!currentAccountStorage) {
		return [];
	}

	const remoteAddresses = currentAccountStorage.addedRegistrationAddresses || [];

	return remoteAddresses;
};

const removeRemoteAddressesFromLocalStorage = ({ network, account, address }) => {

	let accounts = localStorage.getItem(`accounts_${network}`);

	accounts = accounts ? JSON.parse(accounts) : [];

	const currentAccountStorage = accounts.find(({ name }) => name === account);

	if (!currentAccountStorage) {
		return;
	}

	const remoteAddresses = currentAccountStorage.addedRegistrationAddresses || [];

	const filteredAddresses = remoteAddresses.filter((a) => a.address !== address);

	currentAccountStorage.addedRegistrationAddresses = filteredAddresses;

	localStorage.setItem(`accounts_${network}`, JSON.stringify(accounts));
};

export const getRemoteAddressesForRegistration = () => (dispatch, getState) => {
	const account = getState().global.getIn(['activeUser', 'name']);
	const network = getState().global.getIn(['network', 'name']);

	if (!account || !network) {
		return;
	}

	const remoteAddresses = getRemoteAddressesFromLocalStorage({ network, account });

	const remoteAddressesList = new List(remoteAddresses);

	dispatch(GlobalReducer.actions.set({ field: 'remoteRegistrationAddresses', value: remoteAddressesList }));
};

export const saveRemoteAddressForRegistration = () => async (dispatch, getState) => {
	const address = getState().form.getIn([FORM_SIGN_UP_OPTIONS, 'ipOrUrl']);
	const account = getState().global.getIn(['activeUser', 'name']);
	const network = getState().global.getIn(['network', 'name']);

	if (!account || !address.value || address.error || !network) {
		return;
	}

	saveRemoteAddressToLocalStorage({ address: address.value, network, account });
	dispatch(getRemoteAddressesForRegistration());
	dispatch(setValue(FORM_SIGN_UP_OPTIONS, 'showSaveAddressTooltip', false));
};

export const removeRemoteAddressesForRegistration = (address) => async (dispatch, getState) => {
	const account = getState().global.getIn(['activeUser', 'name']);
	const network = getState().global.getIn(['network', 'name']);

	if (!account || !address || !network) {
		return;
	}

	removeRemoteAddressesFromLocalStorage({ address, network, account });
	dispatch(getRemoteAddressesForRegistration());
};

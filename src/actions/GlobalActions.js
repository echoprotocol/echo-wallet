import { Map, List } from 'immutable';
import echo from 'echojs-lib';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import {
	SIGN_IN_PATH,
	INDEX_PATH,
	AUTH_ROUTES,
	CREATE_PASSWORD_PATH,
} from '../constants/RouterConstants';
import { MODAL_WIPE, MODAL_LOGOUT } from '../constants/ModalConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';
import { ECHO_ASSET_ID, NETWORKS, USER_STORAGE_SCHEMES, GLOBAL_ERROR_TIMEOUT } from '../constants/GlobalConstants';
import { FORM_ADD_CUSTOM_NETWORK, FORM_PERMISSION_KEY, FORM_PASSWORD_CREATE } from '../constants/FormConstants';


import {
	validateNetworkName,
	validateNetworkAddress,
	validatePassword,
} from '../helpers/ValidateHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';
import { formatError } from '../helpers/FormatHelper';

import {
	initBalances,
	getObject,
	resetBalance,
	getPreviewBalances,
} from './BalanceActions';
import { initSorts } from './SortActions';
import { loadContracts } from './ContractActions';
import { clearTable } from './TableActions';
import { setFormError, clearForm, toggleLoading, setValue } from './FormActions';
import { closeModal, setError } from './ModalActions';

import Services from '../services';

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

		const { id, name } = await echo.api.getAccountByName(accountName);
		echo.subscriber.setGlobalSubscribe(getObject);

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			history.push(CREATE_PASSWORD_PATH);
		} else if (AUTH_ROUTES.includes(history.location.pathname)) {
			history.push(INDEX_PATH);
		}

		await dispatch(initBalances(id, networkName));
		dispatch(initSorts(networkName));
		dispatch(loadContracts(id, networkName));
		dispatch(clearForm(FORM_PERMISSION_KEY));

		dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));
	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(err) }));
	} finally {
		setTimeout(() => {
			dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
		}, 1000);
	}
};

export const setIsConnectedStatus = (isConnect) => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field: 'isConnected', value: isConnect }));
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	if (ELECTRON && window.ipcRenderer) {
		window.ipcRenderer.send('showWindow');
	}

	let network = localStorage.getItem('current_network');

	if (!network) {
		[network] = NETWORKS;
		localStorage.setItem('current_network', JSON.stringify(network));
	} else {
		network = JSON.parse(network);
	}

	dispatch(GlobalReducer.actions.set({ field: 'network', value: new Map(network) }));

	let networks = localStorage.getItem('custom_networks');
	networks = networks ? JSON.parse(networks) : [];

	dispatch(GlobalReducer.actions.set({ field: 'networks', value: new List(networks) }));

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.init();
		await userStorage.setNetworkId(network.name);
		const doesDBExist = await userStorage.doesDBExist();
		if (!doesDBExist) {
			history.push(CREATE_PASSWORD_PATH);
		}

		await echo.connect(network.url);
		let accounts = localStorage.getItem(`accounts_${network.name}`);

		accounts = accounts ? JSON.parse(accounts) : [];

		if (!accounts.length) {
			if (!AUTH_ROUTES.includes(history.location.pathname) && doesDBExist) {
				history.push(SIGN_IN_PATH);
			}
		} else {
			const active = accounts.find((i) => i.active) || accounts[0];
			await dispatch(initAccount(active.name, network.name));
		}

		await echo.api.getObject(ECHO_ASSET_ID);
		dispatch(GlobalReducer.actions.set({ field: 'inited', value: true }));

		echo.subscriber.setStatusSubscribe('connect', dispatch(setIsConnectedStatus(true)));
		echo.subscriber.setStatusSubscribe('disconnect', dispatch(setIsConnectedStatus(false)));

	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: formatError(err) }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};

export const disconnection = () => async (dispatch) => {

	if (echo.isConnected) {
		await echo.disconnect();
	}

	echo.subscriber.reset();
	dispatch(clearTable(HISTORY_TABLE));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.disconnect());
};

export const setGlobalError = (err) => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field: 'globalError', value: err }));

	setTimeout(() => {
		dispatch(GlobalReducer.actions.set({ field: 'globalError', value: null }));
	}, GLOBAL_ERROR_TIMEOUT);
};

export const toggleBar = (value) => (dispatch) => {
	dispatch(GlobalReducer.actions.toggleBar({ value }));
};

export const push = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.push({ field, param, value }));
};

export const update = (field, param, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.update({ field, param, value }));
};

export const remove = (field, param) => (dispatch) => {
	dispatch(GlobalReducer.actions.remove({ field, param }));
};

export const removeAccount = (accountName, password) => async (dispatch, getState) => {
	const userStorage = Services.getUserStorage();
	await userStorage.setScheme(USER_STORAGE_SCHEMES.MANUAL, password);
	const correctPassword = await userStorage.isMasterPassword(password);

	if (!correctPassword) {
		dispatch(setError(MODAL_LOGOUT, 'Invalid password'));
		return;
	}

	const account = await echo.getAccountByName(accountName);

	await userStorage.removeKeys(account.getIn(['active', 'key_auths']).map(([k]) => k), { password });

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

		echo.subscriber.reset();
		echo.cache.reset();
	}

	if (activeAccountName === accountName && accounts[0]) {
		dispatch(initAccount(accounts[0].name, networkName));
	} else {
		dispatch(getPreviewBalances(networkName));
	}
};

export const isAccountAdded = (accountName, networkName) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	if (accounts.find(({ name }) => name === accountName)) {
		return 'Account already added';
	}

	return null;
};

export const addAccount = (accountName, networkName) => (dispatch) => {
	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];
	accounts.push({ name: accountName, active: false });

	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

	dispatch(clearTable(HISTORY_TABLE));
	dispatch(resetBalance());

	dispatch(initAccount(accountName, networkName));
};

export const saveNetwork = (network) => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	await dispatch(disconnection());

	localStorage.setItem('current_network', JSON.stringify(network));
	dispatch(connection());

	const userStorage = Services.getUserStorage();
	await userStorage.setNetworkId(network.name);
};

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
		nameError = `Network "${network.name}" already exists`;
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

	toastSuccess(`${network.name} network added successfully!`);

	history.goBack();
};

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

export const deleteNetwork = (network) => (dispatch, getState) => {
	let customNetworks = localStorage.getItem('custom_networks');
	customNetworks = customNetworks ? JSON.parse(customNetworks) : [];
	customNetworks = customNetworks.filter((i) => i.name !== network.name);

	localStorage.setItem('custom_networks', JSON.stringify(customNetworks));

	toastInfo(
		`You have removed ${network.name} from networks list`,
		() => dispatch(enableNetwork(network)),
		() => {},
	);

	const currentNetwork = getState().global.get('network').toJS();
	if (currentNetwork.name === network.name) {
		localStorage.removeItem('current_network');
		dispatch(connection());
		return;
	}

	let networks = getState().global.get('networks').toJS();
	networks = networks.filter((i) => i.name !== network.name);

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));
};

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

export const resetData = () => async (dispatch) => {
	dispatch(closeModal(MODAL_WIPE));

	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		echo.subscriber.reset();
		echo.cache.reset();

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

import { Map, List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import {
	SIGN_IN_PATH,
	INDEX_PATH,
	AUTH_ROUTES,
} from '../constants/RouterConstants';
import { HISTORY_TABLE } from '../constants/TableConstants';
import { NETWORKS } from '../constants/GlobalConstants';
import { FORM_ADD_CUSTOM_NETWORK } from '../constants/FormConstants';

import {
	validateNetworkName,
	validateNetworkAddress,
	validateNetworkRegistrator,
} from '../helpers/ValidateHelper';
import { toastSuccess, toastInfo } from '../helpers/ToastHelper';

import { initBalances, getObject, resetBalance } from './BalanceActions';
import { initSorts } from './SortActions';
import { loadContracts } from './ContractActions';
import { clearTable } from './TableActions';
import { setFormError, clearForm } from './FormActions';

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

		const { id, name } = (await dispatch(EchoJSActions.fetch(accountName))).toJS();

		if (AUTH_ROUTES.includes(history.location.pathname)) {
			history.push(INDEX_PATH);
		}

		await dispatch(initBalances(id, networkName));
		dispatch(initSorts(networkName));
		dispatch(loadContracts(id, networkName));

		dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));
	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: err }));
	} finally {
		setTimeout(() => {
			dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
		}, 1000);
	}
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

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
		await dispatch(EchoJSActions.connect(
			network.url,
			{ types: ['objects', 'block'], method: getObject },
		));
		let accounts = localStorage.getItem(`accounts_${network.name}`);

		accounts = accounts ? JSON.parse(accounts) : [];

		if (!accounts.length) {
			if (!AUTH_ROUTES.includes(history.location.pathname)) {
				history.push(SIGN_IN_PATH);
			}
		} else {
			const active = accounts.find((i) => i.active);
			await dispatch(initAccount(active.name, network.name));
		}

	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: err }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};

export const disconnection = (address) => (dispatch, getState) => {
	const isConnected = getState().echojs.getIn(['system', 'isConnected']);

	if (isConnected) {
		dispatch(EchoJSActions.disconnect(address));
	}

	dispatch(clearTable(HISTORY_TABLE));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.disconnect());
};

export const toggleBackButton = () => (dispatch, getState) => {
	const showBackButton = getState().global.get('showBackButton');
	if (showBackButton) return;
	dispatch(GlobalReducer.actions.set({ field: 'showBackButton', value: true }));
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

export const logout = () => async (dispatch, getState) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	const accountName = getState().global.getIn(['activeUser', 'name']);
	const networkName = getState().global.getIn(['network', 'name']);

	let accounts = localStorage.getItem(`accounts_${networkName}`);
	accounts = accounts ? JSON.parse(accounts) : [];

	accounts = accounts.filter(({ name }) => name !== accountName);
	localStorage.setItem(`accounts_${networkName}`, JSON.stringify(accounts));

	if (accounts[0]) {
		await dispatch(initAccount(accounts[0].name, networkName));
	} else {
		dispatch(clearTable(HISTORY_TABLE));
		dispatch(resetBalance());
		dispatch(GlobalReducer.actions.logout());
		history.push(SIGN_IN_PATH);
	}

	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
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

export const saveNetwork = (network) => (dispatch, getState) => {
	const oldNetwork = getState().global.get('network').toJS();

	dispatch(disconnection(oldNetwork.url));

	localStorage.setItem('current_network', JSON.stringify(network));
	dispatch(connection());
};

export const addNetwork = () => (dispatch, getState) => {
	const networks = getState().global.get('networks').toJS();
	const {
		address, name, registrator, autoswitch,
	} = getState().form.get(FORM_ADD_CUSTOM_NETWORK).toJS();

	const network = {
		url: address.value.trim(),
		name: name.value.trim(),
		registrator: registrator.value.trim(),
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

	const registratorError = validateNetworkRegistrator(network.registrator);

	if (registratorError) {
		dispatch(setFormError(FORM_ADD_CUSTOM_NETWORK, 'registrator', registratorError));
	}

	if (nameError || addressError || registratorError) { return; }

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

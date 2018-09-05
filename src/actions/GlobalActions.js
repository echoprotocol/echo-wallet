import { Map, List } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import {
	SIGN_IN_PATH,
	SIGN_UP_PATH,
	INDEX_PATH,
	AUTH_ROUTES,
} from '../constants/RouterConstants';
import { HISTORY } from '../constants/TableConstants';
import { NETWORKS } from '../constants/GlobalConstants';
import { FORM_ADD_CUSTOM_NETWORK } from '../constants/FormConstants';

import {
	validateNetworkName,
	validateNetworkAddress,
	validateNetworkRegistrator,
} from '../helpers/ValidateHelper';

import { initBalances, getObject, resetBalance } from './BalanceActions';
import { initSorts } from './SortActions';
import { loadContracts } from './ContractActions';
import { clearTable } from './TableActions';
import { setFormError, clearForm } from './FormActions';

export const initAccount = (accountName, networkName) => async (dispatch) => {
	localStorage.setItem(`current_account_${networkName}`, accountName);

	const { id, name } = (await dispatch(EchoJSActions.fetch(accountName))).toJS();

	let accounts = localStorage.getItem('accounts');

	accounts = accounts ? JSON.parse(accounts) : [];

	// if (!accounts.find((account) => account.name === accountName)) {
	// 	accounts.unshift({ id, name: accountName });
	// } else {
	// 	accounts.forEach((account, i) => {
	// 		if (account.name === accountName) {
	// 			accounts.splice(i, 1);
	// 			accounts.unshift(account);
	// 		}
	// 	});
	// }
	let isChange = false;

	accounts.forEach((account, i) => {
		if (account.name === accountName) {
			accounts.splice(i, 1);
			accounts.unshift(account);
			isChange = true;
		}
	});

	if (!isChange) {
		accounts.unshift({ id, name: accountName });
	}
	localStorage.setItem('accounts', JSON.stringify(accounts));

	dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id, name } }));

	if (AUTH_ROUTES.includes(history.location.pathname)) {
		history.push(INDEX_PATH);
	}

	await dispatch(initBalances(id, networkName));
	dispatch(initSorts(networkName));
	dispatch(loadContracts(id, networkName));
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
	networks = NETWORKS.concat(networks);

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
			if (process.env.NODE_ENV !== 'development') {
				history.push(INDEX_PATH);
			}

			await dispatch(initAccount(accounts[0].name, network.name));
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

	dispatch(clearTable(HISTORY));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.disconnect());
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

// export const logout = () => (dispatch, getState) => {
// 	const networkName = getState().global.getIn(['network', 'name']);
//
// 	localStorage.removeItem(`current_account_${networkName}`);
//
// 	dispatch(clearTable(HISTORY));
// 	dispatch(resetBalance());
// 	dispatch(GlobalReducer.actions.logout());
//
// 	history.push(SIGN_IN_PATH);
// };

export const formatAccountsBalances = () => async (dispatch) => {
	let accounts = localStorage.getItem('accounts');

	accounts = accounts ? JSON.parse(accounts) : [];

	let accountsBalances = accounts.map(async (account) => {
		const accountData = (await dispatch(EchoJSActions.fetch(account.id))).toJS();
		let stats = null;
		if (accountData.balances) {
			stats = (await dispatch(EchoJSActions.fetch(accountData.balances['1.3.0']))).toJS();
		}
		return { name: account.name, balance: stats ? stats.balance : null };
	});

	accountsBalances = await Promise.all(accountsBalances);

	dispatch(GlobalReducer.actions.set({
		field: 'accounts',
		value: new List(accountsBalances),
	}));
};

export const logout = () => async (dispatch, getState) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));
	const accountName = getState().global.getIn(['activeUser', 'name']);
	let accounts = localStorage.getItem('accounts');
	try {
		accounts = JSON.parse(accounts);
	} catch (e) {
		accounts = [];
	}

	const currAccountIndex = accounts.findIndex((account) => account.name === accountName);

	if (currAccountIndex !== -1) {
		accounts.splice(currAccountIndex, 1);
		localStorage.setItem('accounts', JSON.stringify(accounts));
		dispatch(formatAccountsBalances());
	}

	if (accounts.length) {
		await dispatch(initAccount(accounts[0].name));
	} else {
		dispatch(GlobalReducer.actions.set({ field: 'isAddAccount', value: false }));
		localStorage.removeItem('accounts');
		dispatch(GlobalReducer.actions.setIn({ field: 'activeUser', params: { id: '', name: '' } }));
		dispatch(clearTable(HISTORY));
		dispatch(resetBalance());
		history.push(SIGN_IN_PATH);
	}
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
};

export const addAccount = () => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field: 'isAddAccount', value: true }));

	history.push(SIGN_UP_PATH);
};

export const saveNetwork = (network) => (dispatch, getState) => {
	const oldNetwork = getState().global.get('network').toJS();

	dispatch(disconnection(oldNetwork.url));

	localStorage.setItem('current_network', JSON.stringify(network));
	dispatch(connection());
};

export const addNetwork = (address, name, registrator) => (dispatch, getState) => {
	const network = {
		url: address.value.trim(),
		name: name.value.trim(),
		registrator: registrator.value.trim(),
	};

	let nameError = validateNetworkName(network.name);

	if (NETWORKS.find((i) => i.name === network.name)) {
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

	const networks = getState().global.get('networks').toJS();
	networks.push(network);

	dispatch(GlobalReducer.actions.set({
		field: 'networks',
		value: new List(networks),
	}));

	dispatch(clearForm(FORM_ADD_CUSTOM_NETWORK));
};

export const deleteNetwork = (network) => (dispatch, getState) => {
	let customNetworks = localStorage.getItem('custom_networks');
	customNetworks = customNetworks ? JSON.parse(customNetworks) : [];
	customNetworks = customNetworks.filter((i) => i.name !== network.name);

	localStorage.setItem('custom_networks', JSON.stringify(customNetworks));

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

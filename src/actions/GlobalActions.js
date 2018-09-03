import { Map } from 'immutable';
import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import {
	SIGN_IN_PATH,
	INDEX_PATH,
	AUTH_ROUTES,
} from '../constants/RouterConstants';
import { HISTORY } from '../constants/TableConstants';
import { NETWORKS } from '../constants/GlobalConstants';

import { initBalances, getObject, resetBalance } from './BalanceActions';
import { initSorts } from './SortActions';
import { loadContracts } from './ContractActions';
import { clearTable } from './TableActions';

export const initAccount = (accountName, networkName) => async (dispatch) => {
	localStorage.setItem(`current_account_${networkName}`, accountName);

	const { id, name } = (await dispatch(EchoJSActions.fetch(accountName))).toJS();

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

	try {
		await dispatch(EchoJSActions.connect(
			network.url,
			{ types: ['objects', 'block'], method: getObject },
		));

		const accountName = localStorage.getItem(`current_account_${network.name}`);

		if (!accountName) {
			if (!AUTH_ROUTES.includes(history.location.pathname)) {
				history.push(SIGN_IN_PATH);
			}
		} else {
			if (process.env.NODE_ENV !== 'development') {
				history.push(INDEX_PATH);
			}

			await dispatch(initAccount(accountName, network.name));
		}

	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: err }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}
};

export const disconnection = (address) => (dispatch) => {
	dispatch(EchoJSActions.disconnect(address));
	dispatch(clearTable(HISTORY));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.disconnect());
};

export const toggleBar = (value) => (dispatch) => {
	dispatch(GlobalReducer.actions.toggleBar({ value }));
};

export const hideBar = () => (dispatch) => {
	dispatch(GlobalReducer.actions.hideBar());
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

export const logout = () => (dispatch, getState) => {
	const networkName = getState().global.getIn(['network', 'name']);

	localStorage.removeItem(`current_account_${networkName}`);

	dispatch(clearTable(HISTORY));
	dispatch(resetBalance());
	dispatch(GlobalReducer.actions.clear());

	history.push(SIGN_IN_PATH);
};

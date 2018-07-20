import { actions as EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES } from '../constants/RouterConstants';


export const initAccount = (accountName) => (dispatch) => {
	localStorage.setItem('current_account', accountName);

	dispatch(EchoJSActions.initAccount(accountName));

	if (AUTH_ROUTES.includes(history.location.pathname)) {
		history.push(INDEX_PATH);
	}
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		await dispatch(EchoJSActions.connect('wss://node.testnet.bitshares.eu'));
	} catch (err) {
		dispatch(GlobalReducer.actions.set({ field: 'error', value: err }));
	} finally {
		dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: false }));
	}

	const accountName = localStorage.getItem('current_account');

	if (!accountName) {
		if (!AUTH_ROUTES.includes(history.location.pathname)) {
			history.push(SIGN_IN_PATH);
		}
		return;
	}

	dispatch(initAccount(accountName));
};


export const logout = () => () => {
	localStorage.removeItem('current_account');
	history.push(SIGN_IN_PATH);
};

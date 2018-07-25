import { EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES } from '../constants/RouterConstants';


export const initAccount = (accountName) => async (dispatch) => {
	localStorage.setItem('current_account', accountName);

	history.push(INDEX_PATH);

	const value = await dispatch(EchoJSActions.fetch(accountName));

	dispatch(GlobalReducer.actions.set({ field: 'activeUser', value }));
};

export const connection = () => async (dispatch) => {
	dispatch(GlobalReducer.actions.setGlobalLoading({ globalLoading: true }));

	try {
		await dispatch(EchoJSActions.connect());
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

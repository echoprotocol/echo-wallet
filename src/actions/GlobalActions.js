import { actions as EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

import { SIGN_IN_PATH, INDEX_PATH } from '../constants/RouterConstants';

export const initAccount = (accountName) => (dispatch) => {
	localStorage.setItem('current_account', accountName);

	dispatch(EchoJSActions.initAccount(accountName));

	history.push(INDEX_PATH);
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
		history.push(SIGN_IN_PATH);
		return;
	}

	dispatch(initAccount(accountName));
};

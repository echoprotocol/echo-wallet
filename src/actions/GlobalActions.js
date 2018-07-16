import { actions as EchoJSActions } from 'echojs-redux';

import GlobalReducer from '../reducers/GlobalReducer';

import history from '../history';

<<<<<<< HEAD
import { SIGN_IN_PATH, INDEX_PATH, AUTH_ROUTES } from '../constants/RouterConstants';
=======
import { SIGN_IN_PATH, INDEX_PATH } from '../constants/RouterConstants';
>>>>>>> 2c84fc06fb1aa8621462733ebd5a9e68b7500201

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
<<<<<<< HEAD
		if (!AUTH_ROUTES.includes(history.location.pathname)) {
			history.push(SIGN_IN_PATH);
		}
=======
		history.push(SIGN_IN_PATH);
>>>>>>> 2c84fc06fb1aa8621462733ebd5a9e68b7500201
		return;
	}

	dispatch(initAccount(accountName));
};

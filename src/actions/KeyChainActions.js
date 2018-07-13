import KeyChainReducer from './../reducers/KeyChainReducer';
import { validateAccountName, validatePassword } from '../helpers/AuthHelper';
import { mods, EXPIRED_TIME } from '../constants/KeyChainConstants';

export const reset = () => (dispatch) => {
	dispatch(KeyChainReducer.actions.reset());
	return Promise.resolve();
};

export const setMode = (mode) => (dispatch) => {
	dispatch(KeyChainReducer.actions.setMode(mode || 'lock'));
	return Promise.resolve();
};

export const get = (key) => (dispatch, getState) =>{
	const state = getState();

	return Promise.resolve(state.keychain.getIn(['storage', key]));
};

export const set = (key, credentials) => (dispatch, getState) =>  {
	const state = getState();

	const error =
            validateAccountName(credentials.username) ||
            validatePassword(credentials.password);
	if (error) return Promise.reject(error);

	const mode = state.keychain.getIn(['properties', 'mode']);

	if (mode === mods.LOCK) return Promise.resolve(null);

	const value = {
		username: credentials.username,
		wif: credentials.password,
		pub: key,
		role: credentials.role,
	};

	dispatch(KeyChainReducer.actions.set({ key, value }));

	if (mode === mods.EXPIRED) {
		let timeoutId = state.keychain.getIn(['properties', 'timeoutId']);

		clearTimeout(timeoutId);

		timeoutId = setTimeout(async () => {
			await reset()(dispatch);
			dispatch(KeyChainReducer.actions.setTimeout(null));
		}, EXPIRED_TIME);

		dispatch(KeyChainReducer.actions.setTimeout(timeoutId));
	}
	return Promise.resolve(null);
};


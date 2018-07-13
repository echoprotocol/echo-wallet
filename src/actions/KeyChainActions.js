import KeyChainReducer from './../reducers/KeyChainReducer';
import { validateAccountName, validatePassword } from '../helpers/AuthHelper';
import { mods, EXPIRED_TIME } from '../constants/KeyChainConstants';

export default class KeyChainlActions {

	static get(key) {
		return (dispatch, getState) => new Promise((resolve) => {
			const state = getState();

			return resolve(state.keychain.getIn(['storage', key]));
		});
	}

	static set(key, credentials) {
		return (dispatch, getState) => new Promise((resolve, reject) => {
			const state = getState();

			const error =
                validateAccountName(credentials.username) ||
                validatePassword(credentials.password);
			if (error) return reject(error);

			const mode = state.keychain.getIn(['properties', 'mode']);

			if (mode === mods.LOCK) return resolve(null);

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
					await KeyChainlActions.reset()(dispatch);
					dispatch(KeyChainlActions.actions.setTimeout(null));
				}, EXPIRED_TIME);

				dispatch(KeyChainlActions.actions.setTimeout(timeoutId));
			}
			return resolve(null);
		});
	}

	static reset() {
	    return (dispatch) => new Promise((resolve) => {
			dispatch(KeyChainReducer.actions.reset());
			return resolve();
		});
	}

	static setMode(mode) {
		return (dispatch) => new Promise((resolve) => {
			dispatch(KeyChainReducer.actions.setMode(mode || 'lock'));
			return resolve();
		});
	}

}

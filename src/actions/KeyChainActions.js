import KeyChainReducer from '../reducers/KeyChainReducer';
import { validateAccountName, validatePassword } from '../helpers/ValidateHelper';
import { mods, EXPIRED_TIME } from '../constants/KeyChainConstants';

export const reset = () => (dispatch) => {
	dispatch(KeyChainReducer.actions.reset());
};

export const setMode = (mode) => (dispatch) => {
	dispatch(KeyChainReducer.actions.setMode(mode || 'lock'));
};

export const set = (
	{ privateKey, publicKey },
	username,
	password,
	role,
) => (dispatch, getState) => {
	const state = getState();

	const error = validateAccountName(username) || validatePassword(password);
	if (error) {
		throw new Error(error);
	}

	const mode = state.keychain.getIn(['properties', 'mode']);

	if (mode === mods.LOCK) { return; }

	const value = {
		privateKey: privateKey.toHex(),
		publicKey,
		username,
		password,
		role,
	};

	dispatch(KeyChainReducer.actions.set({ key: publicKey, value }));

	if (mode === mods.EXPIRED) {
		let timeoutId = state.keychain.getIn(['properties', 'timeoutId']);

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			dispatch(reset());
			dispatch(KeyChainReducer.actions.setTimeout(null));
		}, EXPIRED_TIME);

		dispatch(KeyChainReducer.actions.setTimeout(timeoutId));
	}
};

export const getPrivateKey = (publicKey) => (dispatch, getState) => getState().keychain.getIn([publicKey, 'privateKey']);

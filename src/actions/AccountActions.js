import { EchoJSActions } from 'echojs-redux';

import AccountReducer from '../reducers/AssetReducer';

export const setValue = (asset, field, value) => (dispatch) => {
	dispatch(AccountReducer.actions.set({ asset, field, value }));
};

export const setAccountBalances = (id) => async (dispatch) => {
	const balances = (await dispatch(EchoJSActions.fetch(id[1]))).toJS().balance;
	const asset = (await dispatch(EchoJSActions.fetch(id[0]))).toJS();
	dispatch(setValue('asset', 'balance', balances));
	dispatch(setValue('asset', 'symbol', asset.symbol));
	dispatch(setValue('asset', 'precision', asset.precision));
};

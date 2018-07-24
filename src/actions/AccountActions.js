import { FetchChain } from 'echojs-lib';

import TableReducer from '../reducers/AccountReducer';

export const setValue = (account, field, value) => (dispatch) => {
	dispatch(TableReducer.actions.set({ account, field, value }));
};

export const setAccountBalances = (id) => async (dispatch) => {
	const balances = (await FetchChain('getBalanceObjects', id)).toJS();
	dispatch(setValue('account', 'balances', balances));
};

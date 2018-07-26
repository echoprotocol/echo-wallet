import { EchoJSActions } from 'echojs-redux';
import { getBalance } from '../api/ContractApi';
import BalanceReducer from '../reducers/BalanceReducer';

export const initBalances = (accountId) => async (dispatch) => {
	/**
	 *  Tokens structure
	 *  tokens: {
	 *  	[accountId]: {
	 *  		[tokenName]: [contractId]
	 *  	}
	 *  }
	 */
	const tokens = localStorage.getItem('tokens');
	const assets = (await dispatch(EchoJSActions.fetch(accountId))).toJS().balances;

	if (tokens && tokens[accountId]) {
		const balances = Object.keys(tokens[accountId]).map(async (tokenName) => {
			const balance = await getBalance(tokens[accountId][tokenName], accountId);
			return { name: tokenName, balance };
		});

		dispatch(BalanceReducer.actions.set({
			field: 'tokens',
			value: await Promise.all(balances),
		}));
	}

	if (Object.keys(assets).length) {
		const balances = Object.entries(assets).map(async (asset) => {
			const balance = (await dispatch(EchoJSActions.fetch(asset[1]))).toJS();
			const tempAsset = (await dispatch(EchoJSActions.fetch(asset[0]))).toJS();
			return {
				balance: balance.balance,
				precision: tempAsset.precision,
				symbol: tempAsset.symbol,
			};
		});

		dispatch(BalanceReducer.actions.set({
			field: 'assets',
			value: await Promise.all(balances),
		}));
	}
};

export const addToken = () => {
	//	TODO add token logic
};

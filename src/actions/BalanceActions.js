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

};

export const addToken = () => {
	//	TODO add token logic
};

import { FetchChain } from 'echojs-lib';

// eslint-disable-next-line import/prefer-default-export
export const getBalancesAcc = async (id) => {
	const balances = (await FetchChain('getBalanceObjects', id)).toJS();
	console.log(balances);
};

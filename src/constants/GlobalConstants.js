import {
	INDEX_PATH,
	BALANCES_PATH,
	TRANSFER_PATH,
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	VIEW_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
} from './RouterConstants';

export const HEADER_TITLE = [
	{
		path: INDEX_PATH,
		title: 'Recent Activity',
	},
	{
		path: BALANCES_PATH,
		title: 'Wallet',
	},
	{
		path: TRANSFER_PATH,
		title: 'Create Payment',
	},
	{
		path: CREATE_CONTRACT_PATH,
		title: 'Smart Contracts',
	},
	{
		path: CONTRACT_LIST_PATH,
		title: 'Smart Contracts',
	},
	{
		path: VIEW_CONTRACT_PATH,
		title: 'Smart Contracts',
	},
	{
		path: ADD_CONTRACT_PATH,
		title: 'Smart Contracts',
	},
	{
		path: VIEW_TRANSACTION_PATH,
		title: 'Transaction',
	},
];

export const FAUCET_ADDRESS = 'https://echo-tmp-wallet.pixelplex.io/faucet';

export const SORT_CONTRACTS = 'contracts';

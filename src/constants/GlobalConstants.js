import {
	INDEX_PATH,
	BALANCES_PATH,
	TRANSFER_PATH,
	CREATE_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	VIEW_CONTRACTS_PATH,
	TO_WATCH_LIST_PATH,
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
		title: 'Send',
	},
	{
		path: CREATE_CONTRACT_PATH,
		title: 'Create Contract',
	},
	{
		path: SMART_CONTRACTS_PATH,
		title: 'Smart Contracts',
	},
	{
		path: VIEW_CONTRACTS_PATH,
		title: 'Smart Contract Details',
	},
	{
		path: TO_WATCH_LIST_PATH,
		title: 'Smart Contract',
	},
];

export const FAUCET_ADDRESS = 'https://echo-tmp-wallet.pixelplex.io/faucet';

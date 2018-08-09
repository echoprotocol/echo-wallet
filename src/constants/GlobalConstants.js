import {
	INDEX_PATH,
	BALANCES_PATH,
	TRANSFER_PATH,
	CREATE_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	VIEW_CONTRACTS_PATH,
	ADD_CONTRACT_PATH,
	TRANSACTION_DETAILS_PATH,
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
		path: ADD_CONTRACT_PATH,
		title: 'Smart Contract',
	},
	{
		path: TRANSACTION_DETAILS_PATH,
		title: 'Transaction:',
	},
];

export const FAUCET_ADDRESS = 'https://echo-tmp-wallet.pixelplex.io/faucet';

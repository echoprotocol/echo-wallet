import {
	INDEX_PATH,
	ACTIVITY_PATH,
	TRANSFER_PATH,
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	VIEW_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
	PERMISSIONS_PATH,
} from './RouterConstants';

export const HEADER_TITLE = [
	{
		path: INDEX_PATH,
		title: 'Wallet',
	},
	{
		path: ACTIVITY_PATH,
		title: 'Recent Activity',
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
		path: CALL_CONTRACT_PATH,
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
	{
		path: PERMISSIONS_PATH,
		title: 'Permissions',
	},
];

export const SORT_CONTRACTS = 'contracts';

export const NETWORKS = [
	{
		name: 'mainnet',
		registrator: 'https://echo-tmp-wallet.pixelplex.io/faucet/registration',
		url: 'wss://echo-devnet-node.pixelplex.io/ws',
	},
	{
		name: 'testnet',
		registrator: 'https://echo-tmp-wallet.pixelplex.io/faucet/registration',
		url: 'wss://echo-devnet-node.pixelplex.io/ws',
	},
];

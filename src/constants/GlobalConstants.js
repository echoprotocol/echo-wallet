import {
	ACTIVITY_PATH,
	BALANCES_PATH,
	TRANSFER_PATH,
	CREATE_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	VIEW_CONTRACTS_PATH,
} from './RouterConstants';

export const HEADER_TITLE = [
	{
		path: ACTIVITY_PATH,
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
];

export const FAUCET_ADDRESS = 'https://echo-tmp-wallet.pixelplex.io/faucet';

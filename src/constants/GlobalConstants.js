import { ACTIVITY_PATH, BALANCES_PATH, TRANSFER_PATH } from './RouterConstants';

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
];

export const FAUCET_ADDRESS = 'https://echo-tmp-wallet.pixelplex.io/faucet';

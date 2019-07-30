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
	COMMITTEE_VOTE_PATH,
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
	{
		path: COMMITTEE_VOTE_PATH,
		title: 'Voting',
	},
];

export const SORT_CONTRACTS = 'contracts';
export const ADDRESS_PREFIX = 'ECHO';
export const PUBLIC_KEY_LENGTH = 44;
export const SORT_ACCOUNTS = 'accounts';
export const ECHO_ASSET_ID = '1.3.0';
export const CONTRACT_ID_PREFIX = '1.14';
export const ECHO_PROXY_TO_SELF_ACCOUNT = '1.2.5';
export const PREFIX_ASSET = '1.3.';

export const SCRYPT_ALGORITHM_PARAMS = {
	N: 2 ** 14,
	r: 8,
	p: 1,
	l: 32,
	SALT_BYTES_LENGTH: 256,
};
export const ENCRYPTED_DB_NAME = 'db';
export const ALGORITHM_IV_BYTES_LENGTH = 16;
export const DB_NAME = 'keyval-store';
export const STORE = 'keyval';
export const ACTIVE_KEY = 'active';
export const ALGORITHM = 'aes-256-cbc';
export const RANDOM_SIZE = 2048;

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 32;

export const KEY_CODE_ENTER = 13;

export const NETWORKS = [
	{
		name: 'devnet',
		url: 'wss://devnet.echo-dev.io/ws',
	},
	{
		name: 'testnet',
		url: 'wss://testnet.echo-dev.io/ws',
	},
];

export const EXPLORER_URL = {
	devnet: 'https://656-echo-explorer.pixelplex-test.by',
	testnet: 'https://explorer.echo.org',
};

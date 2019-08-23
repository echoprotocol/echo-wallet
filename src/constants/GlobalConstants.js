import {
	INDEX_PATH,
	ACTIVITY_PATH,
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
export const ADDRESS_PREFIX = 'ECHO';
export const PUBLIC_KEY_LENGTH = 44;
export const SORT_ACCOUNTS = 'accounts';
export const ECHO_ASSET_ID = '1.3.0';
export const CONTRACT_ID_PREFIX = '1.9';
export const ECHO_PROXY_TO_SELF_ACCOUNT = '1.2.5';
export const PREFIX_ASSET = '1.3.';
export const ACCOUNT_ID_PREFIX = '1.2.';
export const GLOBAL_ERROR_TIMEOUT = 10 * 1000;

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

export const USER_STORAGE_SCHEMES = {
	AUTO: 'AUTO',
	MANUAL: 'MANUAL',
};

export const KEY_CODE_ENTER = 13;

export const NETWORKS = [
	{
		name: 'testnet',
		url: 'wss://testnet.echo-dev.io/ws',
	},
	{
		name: 'devnet',
		url: 'wss://devnet.echo-dev.io/ws',
	},
];

export const EXPLORER_URL = {
	devnet: 'https://656-echo-explorer.pixelplex-test.by',
	testnet: 'https://explorer.echo.org',
};


export const TIME_TOAST_ANIMATION = 5000;
export const DELAY_REMOVE_CONTRACT = 1000;
export const TIME_REMOVE_CONTRACT = TIME_TOAST_ANIMATION + DELAY_REMOVE_CONTRACT;

export const ERC20_HASHES = {
	'totalSupply()': '18160ddd',
	'balanceOf(address)': '70a08231',
	'allowance(address,address)': 'dd62ed3e',
	'transfer(address,uint256)': 'a9059cbb',
	'approve(address,uint256)': '095ea7b3',
	'transferFrom(address,address,uint256)': '23b872dd',
	'Transfer(address,address,uint256)': 'ddf252ad',
};

import { constants } from 'echojs-lib';

import {
	INDEX_PATH,
	ACTIVITY_PATH,
	SMART_CONTRACTS_PATH,
	CONTRACT_LIST_PATH,
	VIEW_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
	PERMISSIONS_PATH,
	FROZEN_FUNDS_PATH,
} from './RouterConstants';

export const HEADER_TITLE = [
	{
		path: INDEX_PATH,
		title: 'wallet_page.title',
	},
	{
		path: ACTIVITY_PATH,
		title: 'recent_activity_page.title',
	},
	{
		path: SMART_CONTRACTS_PATH,
		title: 'smart_contract_page.title',
	},
	{
		path: CALL_CONTRACT_PATH,
		title: 'smart_contract_page.title',
	},
	{
		path: CONTRACT_LIST_PATH,
		title: 'smart_contract_page.title',
	},
	{
		path: VIEW_CONTRACT_PATH,
		title: 'smart_contract_page.title',
	},
	{
		path: ADD_CONTRACT_PATH,
		title: 'smart_contract_page.title',
	},
	{
		path: VIEW_TRANSACTION_PATH,
		title: 'recent_activity_page.table.transaction.title',
	},
	{
		path: PERMISSIONS_PATH,
		title: 'backup_and_permissions_page.title',
	},

	{
		path: FROZEN_FUNDS_PATH,
		title: 'wallet_page.frozen_funds.title',
	},
];

export const SORT_CONTRACTS = 'contracts';
export const ADDRESS_PREFIX = 'ECHO';
export const PUBLIC_KEY_LENGTH = 44;
export const PUBLIC_KEY_LENGTH_43 = 43;
export const SORT_ACCOUNTS = 'accounts';
export const ECHO_ASSET_ID = '1.3.0';
export const ECHO_ASSET_PRECISION = 8;
export const CONTRACT_ID_PREFIX = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT}`;
export const ECHO_PROXY_TO_SELF_ACCOUNT = '1.2.5';
export const PREFIX_ASSET = '1.3.';
export const ACCOUNT_ID_PREFIX = '1.2.';
export const GLOBAL_ERROR_TIMEOUT = 10 * 1000;
export const APPLY_CHANGES_TIMEOUT = 20 * 1000;

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

export const DEFAULT_NETWORK_ID = 'testnet';

export const DEFAULT_NETWORK = {
	name: 'testnet',
	url: 'wss://testnet.echo-dev.io/ws',
};

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

export const BRIDGE_RECEIVE_URL = 'https://bridge.echo.org/receive/';

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

export const SIDE_CHAIN_HASHES = {
	'recipientAddress(uint64)': 'e819f257',
};

export const FREEZE_BALANCE_PARAMS = [
	{
		duration: 90,
		durationMonth: 3,
		multiplier: 13000,
		durationText: '3 months',
		coefficientText: '1.3',
	},
	{
		duration: 180,
		durationMonth: 6,
		multiplier: 14000,
		durationText: '6 months',
		coefficientText: '1.4',
	},
	{
		duration: 360,
		durationMonth: 12,
		multiplier: 15000,
		durationText: '12 months',
		coefficientText: '1.5',
	},
];

export const GIT_REF = 'https://github.com/echoprotocol/echo-wallet/commit/';
export const ECHO_REF = 'https://echo.org/';
export const ECHO_DOCS_LINK = 'https://docs.echo.org/';
export const MIN_ACCESS_VERSION_BUILD = '0.4.0';

export const CSS_TRANSITION_SPEED = 300;

export const DISCONNECT_STATUS = 'disconnect';
export const CONNECT_STATUS = 'connect';

export const REMOTE_NODE = 'remote';
export const LOCAL_NODE = 'local';

export const CONNECTION_TIMEOUT = 5000;
export const MAX_RETRIES = 999999999;
export const PING_TIMEOUT = 7000;
export const PING_INTERVAL = 7000;

export const REGISTRATION = {
	BATCH: 1e3,
	TIMEOUT: 0,
	DEFAULT_THRESHOLD: 1,
	DEFAULT_KEY_WEIGHT: 1,
	DEFAULT_DELEGATE_SHARE: 2000,
};

export const CUSTOM_NODE_BLOCKS_MAX_DIFF = 2;
export const SIDECHAIN_ASSETS_SYMBOLS = {
	1: {
		symbol: 'EBTC',
		precision: 8,
		deposit: true,
		withdraw: true,
	},
	2: {
		symbol: 'EETH',
		precision: 8,
		deposit: true,
		withdraw: true,
	},
	3: {
		symbol: 'SETH',
		precision: 8,
		deposit: true,
		withdraw: false,
	},
	4: {
		symbol: 'SBTC',
		precision: 8,
		deposit: true,
		withdraw: false,
	},
};

export const EN_LOCALE = 'en';
export const TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS = 30000;

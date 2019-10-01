export const SIGN_UP_PATH = '/sign-up';
export const SIGN_IN_PATH = '/sign-in';
export const ACTIVITY_PATH = '/activity';
export const ADD_CONTRACT_PATH = '/add-contract';
export const CREATE_CONTRACT_PATH = '/create-contract';
export const CONTRACT_LIST_PATH = '/contracts';
export const VIEW_CONTRACT_PATH = '/view-contract/:name';
export const VIEW_TRANSACTION_PATH = '/view-transaction';
export const CALL_CONTRACT_PATH = '/call-contract';
export const NETWORKS_PATH = '/networks';
export const PERMISSIONS_PATH = '/permissions';
export const INDEX_PATH = '/';
export const COMMITTEE_VOTE_PATH = '/committee-vote';
export const CREATE_PASSWORD_PATH = '/password-create';
export const FROZEN_FUNDS_PATH = '/frozen-funds';

export const AUTH_ROUTES = [SIGN_UP_PATH, SIGN_IN_PATH];

export const PUBLIC_ROUTES = [SIGN_UP_PATH, SIGN_IN_PATH, NETWORKS_PATH, CREATE_PASSWORD_PATH];

export const CENTER_MODE_ROUTES = [
	CREATE_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	CALL_CONTRACT_PATH,
];

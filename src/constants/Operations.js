import { OPERATIONS_IDS } from 'echojs-lib';

export default {
	transfer: {
		value: OPERATIONS_IDS.transfer,
		name: 'Transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
		signer: 'from',
	},
	account_create: {
		value: OPERATIONS_IDS.account_create,
		name: 'Create account',
		options: {
			from: 'registrar',
			subject: ['name', null],
			value: null,
			asset: null,
		},
		signer: 'registrar',
	},
	account_update: {
		value: OPERATIONS_IDS.account_update,
		name: 'Update account',
		options: {
			from: 'account',
			subject: null,
			value: null,
			asset: null,
		},
		signer: 'account',
	},
	account_whitelist: {
		value: OPERATIONS_IDS.account_whitelist,
		name: 'Account whitelist',
		options: {
			from: 'authorizing_account',
			subject: ['account_to_list', 'name'],
			value: null,
			asset: null,
		},
	},
	account_transfer: {
		value: OPERATIONS_IDS.account_transfer,
		name: 'Transfer Account',
		options: {
			from: 'account_id',
			subject: ['new_owner', 'name'],
			value: null,
			asset: null,
		},
	},
	asset_create: {
		value: OPERATIONS_IDS.asset_create,
		name: 'Create asset',
		options: {
			from: 'issuer',
			subject: ['symbol', null],
			value: null,
			asset: null,
		},
	},
	asset_update: {
		value: OPERATIONS_IDS.asset_update,
		name: 'Update asset',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_update_bitasset: {
		value: OPERATIONS_IDS.asset_update_bitasset,
		name: 'Update SmartCoin',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_update_feed_producers: {
		value: OPERATIONS_IDS.asset_update_feed_producers,
		name: 'Update asset feed producers',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_issue: {
		value: OPERATIONS_IDS.asset_issue,
		name: 'Issue asset',
		options: {
			from: 'issuer',
			subject: ['issue_to_account', 'name'],
			value: 'asset_to_issue.amount',
			asset: 'asset_to_issue.asset_id',
		},
	},
	asset_reserve: {
		value: OPERATIONS_IDS.asset_reserve,
		name: 'Burn asset',
		options: {
			from: 'payer',
			subject: null,
			value: 'amount_to_reserve.amount',
			asset: 'amount_to_reserve.asset_id',
		},
	},
	asset_fund_fee_pool: {
		value: OPERATIONS_IDS.asset_fund_fee_pool,
		name: 'Fund asset fee pool',
		options: {
			from: 'from_account',
			subject: null,
			value: 'amount',
			asset: 'asset_id',
		},
	},
	asset_publish_feed: {
		value: OPERATIONS_IDS.asset_publish_feed,
		name: 'Publish feed',
		options: {
			from: 'publisher',
			subject: ['asset_id', 'symbol'],
			value: 'feed',
			asset: 'asset_id',
		},
	},
	proposal_create: {
		value: OPERATIONS_IDS.proposal_create,
		name: 'Create proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	proposal_update: {
		value: OPERATIONS_IDS.proposal_update,
		name: 'Update proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	proposal_delete: {
		value: OPERATIONS_IDS.proposal_delete,
		name: 'Delete proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_create: {
		value: OPERATIONS_IDS.committee_member_create,
		name: 'Create committee member',
		options: {
			from: 'committee_member_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_update: {
		value: OPERATIONS_IDS.committee_member_update,
		name: 'Update committee member',
		options: {
			from: 'committee_member_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_update_global_parameters: {
		value: OPERATIONS_IDS.committee_member_update,
		name: 'Global parameters update',
		options: {
			from: null,
			subject: null,
			value: null,
			asset: null,
		},
	},
	vesting_balance_create: {
		value: OPERATIONS_IDS.vesting_balance_create,
		name: 'Create vesting balance',
		options: {
			from: 'creator',
			subject: ['owner', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	vesting_balance_withdraw: {
		value: OPERATIONS_IDS.vesting_balance_withdraw,
		name: 'Withdraw vesting balance',
		options: {
			from: 'owner',
			subject: null,
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	balance_claim: {
		value: OPERATIONS_IDS.balance_claim,
		name: 'Claim balance',
		options: {
			from: null,
			subject: ['deposit_to_account', 'name'],
			value: null,
			asset: null,
		},
	},
	override_transfer: {
		value: OPERATIONS_IDS.override_transfer,
		name: 'Override transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	asset_claim_fees: {
		value: OPERATIONS_IDS.asset_claim_fees,
		name: 'Claim asset fees',
		options: {
			from: 'issuer',
			subject: null,
			value: 'amount_to_claim.amount',
			asset: 'amount_to_claim.asset_id',
		},
	},
	contract_create: {
		value: OPERATIONS_IDS.contract_create,
		name: 'Contract create',
		options: {
			from: 'registrar',
			subject: null,
			value: 'value.amount',
			asset: 'value.asset_id',
			code: 'code',
		},
		signer: 'registrar',
	},
	contract_call: {
		value: OPERATIONS_IDS.contract_call,
		name: 'Contract call',
		options: {
			from: 'registrar',
			subject: ['callee', null],
			value: 'value.amount',
			asset: 'value.asset_id',
			code: 'code',
		},
		signer: 'registrar',
	},
	contract_transfer: {
		value: OPERATIONS_IDS.contract_transfer,
		name: 'Contract transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	sidechain_change_config: {
		value: OPERATIONS_IDS.sidechain_change_config,
		name: 'Sidechain change config',
		options: {
			from: null,
			subject: null,
			value: null,
			asset: null,
		},
	},
	account_address_create: {
		value: OPERATIONS_IDS.account_address_create,
		name: 'Account address create',
		options: {
			from: 'owner',
			subject: null,
			value: null,
			asset: null,
		},
	},
	transfer_to_address: {
		value: OPERATIONS_IDS.transfer_to_address,
		name: 'Transfer to address',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount',
			asset: null,
		},
	},
	sidechain_eth_create_address: {
		value: OPERATIONS_IDS.sidechain_eth_create_address,
		name: 'Sidechain eth create address',
		options: {
			from: 'account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	sidechain_eth_approve_address: {
		value: OPERATIONS_IDS.sidechain_eth_approve_address,
		name: 'Sidechain eth approve address',
		options: {
			from: 'committee_member_id',
			subject: ['account', 'name'],
			value: null,
			asset: null,
		},
	},
	sidechain_eth_deposit: {
		value: OPERATIONS_IDS.sidechain_eth_deposit,
		name: 'Sidechain deposit eth',
		options: {
			from: 'committee_member_id',
			subject: ['account', 'name'],
			value: 'value',
			asset: null,
		},
	},
	sidechain_eth_withdraw: {
		value: OPERATIONS_IDS.sidechain_eth_withdraw,
		name: 'Sidechain withdraw eth',
		options: {
			from: 'account',
			subject: ['eth_addr'],
			value: 'value',
			asset: null,
		},
	},
	sidechain_eth_approve_withdraw: {
		value: OPERATIONS_IDS.sidechain_eth_approve_withdraw,
		name: 'Sidechain eth approve withdraw',
		options: {
			from: null,
			subject: ['committee_member_id'],
			value: null,
			asset: null,
		},
	},
	contract_fund_pool: {
		value: OPERATIONS_IDS.contract_fund_pool,
		name: 'Contract fund pool',
		options: {
			from: 'sender',
			subject: ['contract'],
			amount: 'value.amount',
			asset: 'value.asset_id',
		},
	},
	contract_whitelist: {
		value: OPERATIONS_IDS.contract_whitelist,
		name: 'Contract whitelist',
		options: {
			from: 'sender',
			subject: ['contract'],
			value: null,
			asset: null,
		},
	},
	sidechain_eth_issue: {
		value: OPERATIONS_IDS.sidechain_eth_issue,
		name: 'Sidechain eth issue',
		options: {
			from: 'account',
			subject: ['deposit_id'],
			amount: 'value.amount',
			asset: 'value.asset_id',
		},
	},
	sidechain_eth_burn: {
		value: OPERATIONS_IDS.sidechain_eth_burn,
		name: 'Sidechain eth burn',
		options: {
			from: 'account',
			subject: ['withdraw_id'],
			amount: 'value.amount',
			asset: 'value.asset_id',
		},
	},
	sidechain_erc20_register_token: {
		value: OPERATIONS_IDS.sidechain_erc20_register_token,
		name: 'Register ERC20 token',
		options: {
			from: 'account',
			subject: null,
			amount: null,
			asset: null,
		},
	},
	sidechain_erc20_deposit_token: {
		value: OPERATIONS_IDS.sidechain_erc20_deposit_token,
		name: 'Deposit ERC20 token',
		options: {
			from: 'account',
			subject: ['erc20_token_addr'],
			amount: 'value',
			asset: null,
		},
	},
	sidechain_erc20_withdraw_token: {
		value: OPERATIONS_IDS.sidechain_erc20_withdraw_token,
		name: 'Withdraw ERC20 token',
		options: {
			from: 'committee_member_id',
			subject: ['to'],
			amount: 'value',
			asset: null,
		},
	},
	sidechain_erc20_approve_token_withdraw: {
		value: OPERATIONS_IDS.sidechain_erc20_approve_token_withdraw,
		name: 'Approve ERC20 token withdraw',
		options: {
			from: 'account',
			subject: ['to'],
			amount: 'value',
			asset: null,
		},
	},
	contract_update: {
		value: OPERATIONS_IDS.contract_update,
		name: 'Contract update',
		options: {
			from: 'sender',
			subject: ['contract'],
			amount: null,
			asset: null,
		},
	},
};

export default {
	transfer: {
		value: 0,
		name: 'Transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
		permission: 'active',
	},
	limit_order_create: {
		value: 1,
		name: 'Place order',
		options: {
			from: 'seller',
			subject: null,
			value: 'amount_to_sell.amount',
			asset: 'amount_to_sell.asset_id',
		},
	},
	limit_order_cancel: {
		value: 2,
		name: 'Cancel order',
		options: {
			from: 'fee_paying_account',
			subject: ['order', 'name'],
			value: null,
			asset: null,
		},
	},
	call_order_update: {
		value: 3,
		name: 'Update margin',
		options: {
			from: 'funding_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	fill_order: {
		value: 4,
		name: 'Fill order',
		options: {
			from: 'account_id',
			subject: ['order_id', null],
			value: 'pays.amount',
			asset: 'pays.asset_id',
		},
	},
	account_create: {
		value: 5,
		name: 'Create account',
		options: {
			from: 'registrar',
			subject: ['name', null],
			value: null,
			asset: null,
		},
	},
	account_update: {
		value: 6,
		name: 'Update account',
		options: {
			from: 'account',
			subject: null,
			value: null,
			asset: null,
		},
		permission: 'owner',
	},
	account_whitelist: {
		value: 7,
		name: 'Account whitelist',
		options: {
			from: 'authorizing_account',
			subject: ['account_to_list', 'name'],
			value: null,
			asset: null,
		},
	},
	account_upgrade: {
		value: 8,
		name: 'Upgrade Account',
		options: {
			from: 'account_to_upgrade',
			subject: null,
			value: null,
			asset: null,
		},
	},
	account_transfer: {
		value: 9,
		name: 'Transfer Account',
		options: {
			from: 'account_id',
			subject: ['new_owner', 'name'],
			value: null,
			asset: null,
		},
	},
	asset_create: {
		value: 10,
		name: 'Create asset',
		options: {
			from: 'issuer',
			subject: ['symbol', null],
			value: null,
			asset: null,
		},
	},
	asset_update: {
		value: 11,
		name: 'Update asset',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_update_bitasset: {
		value: 12,
		name: 'Update SmartCoin',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_update_feed_producers: {
		value: 13,
		name: 'Update asset feed producers',
		options: {
			from: 'issuer',
			subject: ['asset_to_update', 'symbol'],
			value: null,
			asset: null,
		},
	},
	asset_issue: {
		value: 14,
		name: 'Issue asset',
		options: {
			from: 'issuer',
			subject: ['issue_to_account', 'name'],
			value: 'asset_to_issue.amount',
			asset: 'asset_to_issue.asset_id',
		},
	},
	asset_reserve: {
		value: 15,
		name: 'Burn asset',
		options: {
			from: 'payer',
			subject: null,
			value: 'amount_to_reserve.amount',
			asset: 'amount_to_reserve.asset_id',
		},
	},
	asset_fund_fee_pool: {
		value: 16,
		name: 'Fund asset fee pool',
		options: {
			from: 'from_account',
			subject: null,
			value: 'amount',
			asset: 'asset_id',
		},
	},
	asset_settle: {
		value: 17,
		name: 'Asset settlement',
		options: {
			from: 'account',
			subject: null,
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	asset_global_settle: {
		value: 18,
		name: 'Global asset settlement',
		options: {
			from: 'issuer',
			subject: null,
			value: 'settle_price',
			asset: 'asset_to_settle',
		},
	},
	asset_publish_feed: {
		value: 19,
		name: 'Publish feed',
		options: {
			from: 'publisher',
			subject: ['asset_id', 'symbol'],
			value: 'feed',
			asset: 'asset_id',
		},
	},
	proposal_create: {
		value: 20,
		name: 'Create proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	proposal_update: {
		value: 21,
		name: 'Update proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	proposal_delete: {
		value: 22,
		name: 'Delete proposal',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	withdraw_permission_create: {
		value: 23,
		name: 'Create withdrawal permission',
		options: {
			from: 'withdraw_from_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	withdraw_permission_update: {
		value: 24,
		name: 'Update withdrawal permission',
		options: {
			from: 'withdraw_from_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	withdraw_permission_claim: {
		value: 25,
		name: 'Claim withdrawal permission',
		options: {
			from: 'withdraw_from_account',
			subject: ['withdraw_to_account', 'name'],
			value: 'amount_to_withdraw.amount',
			asset: 'amount_to_withdraw.asset_id',
		},
	},
	withdraw_permission_delete: {
		value: 26,
		name: 'Delete withdrawal permission',
		options: {
			from: 'withdraw_from_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_create: {
		value: 27,
		name: 'Create committee member',
		options: {
			from: 'committee_member_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_update: {
		value: 28,
		name: 'Update committee member',
		options: {
			from: 'committee_member_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	committee_member_update_global_parameters: {
		value: 29,
		name: 'Global parameters update',
		options: {
			from: null,
			subject: null,
			value: null,
			asset: null,
		},
	},
	vesting_balance_create: {
		value: 30,
		name: 'Create vesting balance',
		options: {
			from: 'creator',
			subject: ['owner', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	vesting_balance_withdraw: {
		value: 31,
		name: 'Withdraw vesting balance',
		options: {
			from: 'owner',
			subject: null,
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	custom: {
		value: 32,
		name: 'Custom',
		options: {
			from: 'payer',
			subject: null,
			value: null,
			asset: null,
		},
	},
	assert: {
		value: 33,
		name: 'Assert operation',
		options: {
			from: 'fee_paying_account',
			subject: null,
			value: null,
			asset: null,
		},
	},
	balance_claim: {
		value: 34,
		name: 'Claim balance',
		options: {
			from: null,
			subject: ['deposit_to_account', 'name'],
			value: null,
			asset: null,
		},
	},
	override_transfer: {
		value: 35,
		name: 'Override transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	asset_settle_cancel: {
		value: 36,
		name: 'Cancel asset settlement',
		options: {
			from: 'account',
			subject: null,
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
	asset_claim_fees: {
		value: 37,
		name: 'Claim asset fees',
		options: {
			from: 'issuer',
			subject: null,
			value: 'amount_to_claim.amount',
			asset: 'amount_to_claim.asset_id',
		},
	},
	// BID_COLLATERAL = 38,
	// EXECUTE_BID = 39,
	create_contract: {
		value: 40,
		name: 'Create contract',
		options: {
			from: 'registrar',
			subject: null,
			value: 'value.amount',
			asset: 'value.asset_id',
			code: 'code',
		},
		permission: 'active',
	},
	call_contract: {
		value: 41,
		name: 'Call contract',
		options: {
			from: 'registrar',
			subject: ['callee', null],
			value: 'value.amount',
			asset: 'value.asset_id',
			code: 'code',
		},
		permission: 'active',
	},
	contract_transfer: {
		value: 42,
		name: 'Contract transfer',
		options: {
			from: 'from',
			subject: ['to', 'name'],
			value: 'amount.amount',
			asset: 'amount.asset_id',
		},
	},
};

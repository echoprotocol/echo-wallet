import operations from '../constants/Operations';

const formatOperation = (operationData) => {

	const operation = operationData.op[1];

	const result = {
		operation: '',
		block: '',
		from: '',
		to: '',
		value: '',
		fee: '',
		status: '',
		time: '',
	};
	result.fee = operation.fee.amount || '';
	result.block = operationData.block_num || '';
	result.time = new Date();

	switch (operation.op[0]) {
		case operations.transfer:
			result.operation = operations.transfer;
			result.from = operation.from;
			result.to = operation.to;
			result.value = operation.amount.amount;
			result.status = 'success';
			break;
		case operations.limit_order_create:
			result.operation = operations.limit_order_create;
			result.from = operation.seller;
			result.value = operation.amount_to_sell;
			result.status = 'success';
			break;
		case operations.limit_order_cancel:
			result.operation = operations.limit_order_cancel;
			result.from = operation.fee_paying_account;
			result.value = operation.order;
			result.status = 'success';
			break;
		case operations.call_order_update:
			result.operation = operations.call_order_update;
			result.from = operation.fee_paying_account;
			result.value = operation.order;
			result.status = 'success';
			break;
		case operations.fill_order:
			result.operation = operations.fill_order;
			result.from = operation.account_id;
			result.value = operation.order_id;
			result.status = 'success';
			break;
		case operations.account_create:
			result.operation = operations.account_create;
			result.from = operation.registrar;
			result.to = operation.referrer;
			result.value = operation.name;
			result.status = 'success';
			break;
		case operations.account_update:
			result.operation = operations.account_update;
			result.from = operation.account;
			result.to = operation.account;
			result.status = 'success';
			break;
		case operations.account_whitelist:
			result.operation = operations.account_whitelist;
			result.from = operation.authorizing_account;
			result.value = operation.new_listing;
			result.status = 'success';
			break;
		case operations.account_upgrade:
			result.operation = operations.account_upgrade;
			result.from = operation.account_to_upgrade;
			result.status = 'success';
			break;
		case operations.account_transfer:
			result.operation = operations.account_transfer;
			result.from = operation.account_id;
			result.to = operation.new_owner;
			result.status = 'success';
			break;
		case operations.asset_create:
			result.operation = operations.asset_create;
			result.from = operation.issuer;
			result.value = operation.symbol;
			result.status = 'success';
			break;
		case operations.asset_update:
			result.operation = operations.asset_update;
			result.from = operation.issuer;
			result.to = operation.new_issuer;
			result.status = 'success';
			break;
		case operations.asset_update_bitasset:
			result.operation = operations.asset_update_bitasset;
			result.from = operation.issuer;
			result.value = operation.asset_to_update;
			result.status = 'success';
			break;
		case operations.asset_update_feed_producers:
			result.operation = operations.asset_update_feed_producers;
			result.from = operation.issuer;
			result.value = operation.asset_to_update;
			result.status = 'success';
			break;
		case operations.asset_issue:
			result.operation = operations.asset_issue;
			result.from = operation.issuer;
			result.to = operation.issue_to_account;
			result.status = 'success';
			break;
		case operations.asset_reserve:
			result.operation = operations.asset_reserve;
			result.from = operation.payer;
			result.value = operation.amount_to_reserve;
			result.status = 'success';
			break;
		case operations.asset_fund_fee_pool:
			result.operation = operations.asset_fund_fee_pool;
			result.from = operation.from_account;
			result.value = operation.amount;
			result.status = 'success';
			break;
		case operations.asset_settle:
			result.operation = operations.asset_settle;
			result.from = operation.account;
			result.value = operation.amount;
			result.status = 'success';
			break;
		case operations.asset_global_settle:
			result.operation = operations.asset_global_settle;
			result.from = operation.issuer;
			result.value = operation.settle_price;
			result.status = 'success';
			break;
		case operations.asset_publish_feed:
			result.operation = operations.asset_publish_feed;
			result.from = operation.publisher;
			result.value = operation.asset_id;
			result.status = 'success';
			break;
		case operations.witness_create:
			result.operation = operations.witness_create;
			result.from = operation.witness_account;
			result.value = operation.url;
			result.status = 'success';
			break;
		case operations.witness_update:
			result.operation = operations.witness_update;
			result.from = operation.witness_account;
			result.value = operation.new_url;
			result.status = 'success';
			break;
		case operations.proposal_create:
			result.operation = operations.proposal_create;
			break;
		case operations.proposal_update:
			result.operation = operations.proposal_update;
			break;
		case operations.proposal_delete:
			result.operation = operations.proposal_delete;
			break;
		case operations.withdraw_permission_create:
			result.operation = operations.withdraw_permission_create;
			break;
		case operations.withdraw_permission_update:
			result.operation = operations.withdraw_permission_update;
			break;
		case operations.withdraw_permission_claim:
			result.operation = operations.withdraw_permission_claim;
			break;
		case operations.withdraw_permission_delete:
			result.operation = operations.withdraw_permission_delete;
			break;
		case operations.committee_member_create:
			result.operation = operations.committee_member_create;
			break;
		case operations.committee_member_update:
			result.operation = operations.committee_member_update;
			break;
		case operations.committee_member_update_global_parameters:
			result.operation = operations.committee_member_update_global_parameters;
			break;
		case operations.vesting_balance_create:
			result.operation = operations.vesting_balance_create;
			break;
		case operations.vesting_balance_withdraw:
			result.operation = operations.vesting_balance_withdraw;
			break;
		case operations.worker_create:
			result.operation = operations.worker_create;
			break;
		case operations.custom:
			result.operation = operations.custom;
			break;
		case operations.assert:
			result.operation = operations.assert;
			break;
		case operations.balance_claim:
			result.operation = operations.balance_claim;
			break;
		case operations.override_transfer:
			result.operation = operations.override_transfer;
			break;
		case operations.transfer_to_blind:
			result.operation = operations.transfer_to_blind;
			break;
		case operations.blind_transfer:
			result.operation = operations.blind_transfer;
			break;
		case operations.transfer_from_blind:
			result.operation = operations.transfer_from_blind;
			break;
		case operations.asset_settle_cancel:
			result.operation = operations.asset_settle_cancel;
			break;
		case operations.asset_claim_fees:
			result.operation = operations.asset_claim_fees;
			break;
		case operations.contract:
			result.operation = operations.contract;
			break;
		case operations.contract_transfer:
			result.operation = operations.contract_transfer;
			break;
		default:
			break;
	}

	return result;
};

export default formatOperation;

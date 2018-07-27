import { EchoJSActions } from 'echojs-redux';
import moment from 'moment';

import operations from '../constants/Operations';

const formatOperation = (operationData) => async (dispatch) => {
	const operation = operationData.op[1];
	const operationResult = operationData.result;
	const feeAsset = (await dispatch(EchoJSActions.fetch(operation.fee.asset_id))).toJS();
	const timestampBlock = (await dispatch(EchoJSActions.fetch(operationData.block_num))).timestamp;
	const currentAccount = localStorage.getItem('current_account');

	const result = {
		operation: '',
		block: '',
		from: '',
		subject: '',
		value: {
			amount: '',
			precision: '',
			symbol: '',
		},
		fee: 0,
		status: '',
		timestamp: {
			date: moment(timestampBlock).format('MMMM D, YYYY'),
			time: moment(timestampBlock).format('h:mm:ss A'),
		},
		operationColor: '',
	};
	result.fee = {
		amount: operation.fee.amount || '',
		precision: feeAsset.precision,
		symbol: feeAsset.symbol,
	};
	result.block = operationData.block_num || '';

	switch (operationData.op[0]) {
		case operations.transfer: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.limit_order_create: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_sell.asset_id))
			).toJS();
			result.operation = operations.limit_order_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.seller))).toJS().name;
			result.value = {
				amount: operation.amount_to_sell.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.limit_order_cancel:
			result.operation = operations.limit_order_cancel;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.order))).toJS().name;
			break;
		case operations.call_order_update:
			result.operation = operations.call_order_update;
			result.from = (await dispatch(EchoJSActions.fetch(operation.funding_account))).toJS().name;
			break;
		case operations.fill_order: {
			console.log(operation);
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.pays.asset_id))).toJS();
			result.operation = operations.fill_order;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_id))).toJS().name;
			console.log(await dispatch(EchoJSActions.fetch(operation.order_id)));
			result.value = {
				amount: operation.pays.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.account_create:
			result.operation = operations.account_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.registrar))).toJS().name;
			result.subject = operation.name;
			break;
		case operations.account_update:
			result.operation = operations.account_update;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			break;
		case operations.account_whitelist:
			result.operation = operations.account_whitelist;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.authorizing_account))
			).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.account_to_list))).toJS().name;
			break;
		case operations.account_upgrade:
			result.operation = operations.account_upgrade;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_to_upgrade))).toJS().name;
			break;
		case operations.account_transfer:
			result.operation = operations.account_transfer;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_id))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.new_owner))).toJS().name;
			break;
		case operations.asset_create:
			result.operation = operations.asset_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = operation.symbol;
			break;
		case operations.asset_update:
			result.operation = operations.asset_update;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_update_bitasset:
			result.operation = operations.asset_update_bitasset;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_update_feed_producers:
			result.operation = operations.asset_update_feed_producers;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_issue: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_issue.asset_id))
			).toJS();
			result.operation = operations.asset_issue;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.issue_to_account))
			).toJS().name;
			result.value = {
				amount: operation.asset_to_issue.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_reserve: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_reserve.asset_id))
			).toJS();
			result.operation = operations.asset_reserve;
			result.from = (await dispatch(EchoJSActions.fetch(operation.payer))).toJS().name;
			result.value = {
				amount: operation.amount_to_reserve.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_fund_fee_pool: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.asset_fund_fee_pool;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from_account))).toJS().name;
			result.value = {
				amount: operation.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_settle: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.asset_settle;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_global_settle: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_to_settle))).toJS();
			result.operation = operations.asset_global_settle;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.value = {
				amount: operation.settle_price,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_publish_feed: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.asset_publish_feed;
			result.from = (await dispatch(EchoJSActions.fetch(operation.publisher))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS().symbol;
			result.value = {
				amount: operation.feed,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.witness_create:
			result.operation = operations.witness_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.witness_account))).toJS().name;
			break;
		case operations.witness_update:
			result.operation = operations.witness_update;
			result.from = (await dispatch(EchoJSActions.fetch(operation.witness_account))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.witness))).toJS().name;
			break;
		case operations.proposal_create:
			result.operation = operations.proposal_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.proposal_update:
			result.operation = operations.proposal_update;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.proposal_delete:
			result.operation = operations.proposal_delete;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.withdraw_permission_create:
			result.operation = operations.withdraw_permission_create;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.withdraw_permission_update:
			result.operation = operations.withdraw_permission_update;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.withdraw_permission_claim: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_withdraw.asset_id))
			).toJS();
			result.operation = operations.withdraw_permission_claim;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_to_account))
			).toJS().name;
			result.value = {
				amount: operation.amount_to_withdraw.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.withdraw_permission_delete:
			result.operation = operations.withdraw_permission_delete;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.committee_member_create:
			result.operation = operations.committee_member_create;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.committee_member_account))
			).toJS().name;
			break;
		case operations.committee_member_update:
			result.operation = operations.committee_member_update;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.committee_member_account))
			).toJS().name;
			break;
		case operations.committee_member_update_global_parameters:
			result.operation = operations.committee_member_update_global_parameters;
			break;
		case operations.vesting_balance_create: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.vesting_balance_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.creator))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.vesting_balance_withdraw: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.vesting_balance_withdraw;
			result.from = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.worker_create:
			result.operation = operations.worker_create;
			result.from = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.subject = operations.name;
			break;
		case operations.custom:
			result.operation = operations.custom;
			result.from = (await dispatch(EchoJSActions.fetch(operation.payer))).toJS().name;
			break;
		case operations.assert:
			result.operation = operations.assert;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.balance_claim:
			result.operation = operations.balance_claim;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.deposit_to_account))
			).toJS().name;
			break;
		case operations.override_transfer: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.override_transfer;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.transfer_to_blind: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer_to_blind;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.blind_transfer:
			result.operation = operations.blind_transfer;
			break;
		case operations.transfer_from_blind: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer_from_blind;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_settle_cancel: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.asset_settle_cancel;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_claim_fees: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_claim.asset_id))
			).toJS();
			result.operation = operations.asset_claim_fees;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.value = {
				amount: operation.amount_to_claim.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.create_contract: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.create_contract;
			result.from = (await dispatch(EchoJSActions.fetch(operation.registrar))).toJS().name;
			[, result.subject] = operationResult;
			result.value = {
				amount: operation.value,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.contract_transfer: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.contract_transfer;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		default:
			break;
	}

	result.operationColor = result.from === currentAccount ? 'label-operation yellow' : 'label-operation green';
	result.operation = Object.keys(operations).find((i) => operations[i] === result.operation);

	return result;
};

export default (history) => (dispatch) => history.toJS().map((h) => dispatch(formatOperation(h)));

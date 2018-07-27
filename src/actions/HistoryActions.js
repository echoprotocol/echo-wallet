import { EchoJSActions } from 'echojs-redux';
import moment from 'moment';

import operations from '../constants/Operations';

const formatOperation = (operationData) => async (dispatch, getState) => {
	const operation = operationData.op[1];

	const currentAccount = getState().global.getIn(['activeUser', 'name']);

	const feeAsset = (await dispatch(EchoJSActions.fetch(operation.fee.asset_id))).toJS();

	const timestampBlock = (await dispatch(EchoJSActions.fetch(operationData.block_num))).timestamp;
	const changeTimeParameter = moment(timestampBlock).get('minute') + moment().utcOffset();

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
			date: moment(timestampBlock).set('minute', changeTimeParameter).format('MMMM D, YYYY'),
			time: moment(timestampBlock).set('minute', changeTimeParameter).format('h:mm:ss A'),
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
		case operations.transfer.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.limit_order_create.value: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_sell.asset_id))
			).toJS();
			result.operation = operations.limit_order_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.seller))).toJS().name;
			result.value = {
				amount: operation.amount_to_sell.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.limit_order_cancel.value:
			result.operation = operations.limit_order_cancel.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.order))).toJS().name;
			break;
		case operations.call_order_update.value:
			result.operation = operations.call_order_update.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.funding_account))).toJS().name;
			break;
		case operations.fill_order.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.pays.asset_id))).toJS();
			result.operation = operations.fill_order.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_id))).toJS().name;
			result.subject = operation.order_id;
			result.value = {
				amount: operation.pays.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.account_create.value:
			result.operation = operations.account_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.registrar))).toJS().name;
			result.subject = operation.name;
			break;
		case operations.account_update.value:
			result.operation = operations.account_update.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			break;
		case operations.account_whitelist.value:
			result.operation = operations.account_whitelist.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.authorizing_account))
			).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.account_to_list))).toJS().name;
			break;
		case operations.account_upgrade.value:
			result.operation = operations.account_upgrade.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_to_upgrade))).toJS().name;
			break;
		case operations.account_transfer.value:
			result.operation = operations.account_transfer.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account_id))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.new_owner))).toJS().name;
			break;
		case operations.asset_create.value:
			result.operation = operations.asset_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = operation.symbol;
			break;
		case operations.asset_update.value:
			result.operation = operations.asset_update.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_update_bitasset.value:
			result.operation = operations.asset_update_bitasset.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_update_feed_producers.value:
			result.operation = operations.asset_update_feed_producers.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_update))
			).toJS().symbol;
			break;
		case operations.asset_issue.value: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.asset_to_issue.asset_id))
			).toJS();
			result.operation = operations.asset_issue.name;
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
		case operations.asset_reserve.value: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_reserve.asset_id))
			).toJS();
			result.operation = operations.asset_reserve.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.payer))).toJS().name;
			result.value = {
				amount: operation.amount_to_reserve.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_fund_fee_pool.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.asset_fund_fee_pool.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from_account))).toJS().name;
			result.value = {
				amount: operation.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_settle.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.asset_settle.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_global_settle.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_to_settle))).toJS();
			result.operation = operations.asset_global_settle.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.value = {
				amount: operation.settle_price,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_publish_feed.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.asset_publish_feed.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.publisher))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS().symbol;
			result.value = {
				amount: operation.feed,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.witness_create.value:
			result.operation = operations.witness_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.witness_account))).toJS().name;
			break;
		case operations.witness_update.value:
			result.operation = operations.witness_update.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.witness_account))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.witness))).toJS().name;
			break;
		case operations.proposal_create.value:
			result.operation = operations.proposal_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.proposal_update.value:
			result.operation = operations.proposal_update.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.proposal_delete.value:
			result.operation = operations.proposal_delete.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.withdraw_permission_create.value:
			result.operation = operations.withdraw_permission_create.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.withdraw_permission_update.value:
			result.operation = operations.withdraw_permission_update.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.withdraw_permission_claim.value: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_withdraw.asset_id))
			).toJS();
			result.operation = operations.withdraw_permission_claim.name;
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
		case operations.withdraw_permission_delete.value:
			result.operation = operations.withdraw_permission_delete.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.withdraw_from_account))
			).toJS().name;
			break;
		case operations.committee_member_create.value:
			result.operation = operations.committee_member_create.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.committee_member_account))
			).toJS().name;
			break;
		case operations.committee_member_update.value:
			result.operation = operations.committee_member_update.name;
			result.from = (
				await dispatch(EchoJSActions.fetch(operation.committee_member_account))
			).toJS().name;
			break;
		case operations.committee_member_update_global_parameters.value:
			result.operation = operations.committee_member_update_global_parameters.name;
			break;
		case operations.vesting_balance_create.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.vesting_balance_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.creator))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.vesting_balance_withdraw.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.vesting_balance_withdraw.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.worker_create.value:
			result.operation = operations.worker_create.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.owner))).toJS().name;
			result.subject = operations.name;
			break;
		case operations.custom.value:
			result.operation = operations.custom.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.payer))).toJS().name;
			break;
		case operations.assert.value:
			result.operation = operations.assert.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.fee_paying_account))).toJS().name;
			break;
		case operations.balance_claim.value:
			result.operation = operations.balance_claim.name;
			result.subject = (
				await dispatch(EchoJSActions.fetch(operation.deposit_to_account))
			).toJS().name;
			break;
		case operations.override_transfer.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.override_transfer.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.transfer_to_blind.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer_to_blind.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.from))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.blind_transfer.value:
			result.operation = operations.blind_transfer.name;
			break;
		case operations.transfer_from_blind.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.transfer_from_blind.name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.to))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_settle_cancel.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.asset_settle_cancel.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.account))).toJS().name;
			result.value = {
				amount: operation.amount.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.asset_claim_fees.value: {
			const amountAsset = (
				await dispatch(EchoJSActions.fetch(operation.amount_to_claim.asset_id))
			).toJS();
			result.operation = operations.asset_claim_fees.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.issuer))).toJS().name;
			result.value = {
				amount: operation.amount_to_claim.amount,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.contract.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.asset_id))).toJS();
			result.operation = operations.contract.name;
			result.from = (await dispatch(EchoJSActions.fetch(operation.registrar))).toJS().name;
			result.subject = (await dispatch(EchoJSActions.fetch(operation.receiver))).toJS().name;
			result.value = {
				amount: operation.value,
				precision: amountAsset.precision,
				symbol: amountAsset.symbol,
			};
			break;
		}
		case operations.contract_transfer.value: {
			const amountAsset = (await dispatch(EchoJSActions.fetch(operation.amount.asset_id))).toJS();
			result.operation = operations.contract_transfer.name;
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

	return result;
};

export default (history) => (dispatch) => history.toJS().map((h) => dispatch(formatOperation(h)));

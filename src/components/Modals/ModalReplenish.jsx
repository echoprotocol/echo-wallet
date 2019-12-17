import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_REPLENISH } from '../../constants/ModalConstants';
import AccountField from '../Fields/AccountField';
import AmountField from '../Fields/AmountField';
import { FORM_REPLENISH } from '../../constants/FormConstants';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setFormError, setFormValue, setValue } from '../../actions/FormActions';
import { getContractPoolBalanceFee, replenishContractPool } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';

class ModalToWhitelist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onSend(submit) {
		submit();
	}

	render() {
		const {
			show, activeAccount, isAvailableBalance, currency, amount, assets, fee, fees, intl,
		} = this.props;

		const amountTexts = {
			label: intl.formatMessage({ id: 'amount_input.title' }),
			placeholder: intl.formatMessage({ id: 'amount_input.placeholder' }),
			available: intl.formatMessage({ id: 'amount_input.available' }),
			noRes: intl.formatMessage({ id: 'amount_input.no_result_message' }),
			warningMsgPt1: intl.formatMessage({ id: 'amount_input.warning_message_pt1' }),
			warningMsgPt2: intl.formatMessage({ id: 'amount_input.warning_message_pt2' }),
			warningMsgPt3: intl.formatMessage({ id: 'amount_input.warning_message_pt3' }),
		};

		return (
			<TransactionScenario
				handleTransaction={() => this.props.replenishContractPool()}
			>
				{
					(submit) => (
						<Modal className="replenish-modal" open={show} dimmer="inverted">
							<FocusLock autoFocus={false}>
								<button
									className="icon-close"
									onClick={(e) => this.onClose(e)}
								/>
								<div className="modal-header">
									<h3 className="modal-header-title">
										{intl.formatMessage({ id: 'modals.modal_replenish.title' })}
									</h3>
								</div>
								<div className="modal-body">
									<Form className="main-form">
										<div className="field-wrap">

											{
												activeAccount ?
													<AccountField
														subject="from"
														placeholder={
															intl.formatMessage({ id: 'wallet_page.create_payment.from_input.placeholder' })
														}
														label={
															intl.formatMessage({ id: 'wallet_page.create_payment.from_input.title' })
														}
														field={{
															value: activeAccount.get('name'),
															checked: true,
														}}
														avatarName={activeAccount.get('name')}
														setIn={() => {
														}}
														getTransferFee={() => {
														}}
														setContractFees={() => {
														}}
														setValue={() => {
														}}
														disabled
													/> : null
											}

											<AmountField
												fees={fees}
												form={FORM_REPLENISH}
												fee={fee}
												assets={assets}
												amount={amount}
												currency={currency}
												isAvailableBalance={isAvailableBalance}
												amountInput={this.props.amountInput}
												setFormError={this.props.setFormError}
												setFormValue={this.props.setFormValue}
												setValue={this.props.setValue}
												setDefaultAsset={this.props.setDefaultAsset}
												getTransferFee={this.props.getTransactionFee}
												setContractFees={() => {}}
												autoFocus
												texts={amountTexts}
											/>
										</div>

										<div className="form-panel">
											<Button
												className="main-btn"
												content={intl.formatMessage({ id: 'modals.modal_replenish.confirm_button_text' })}
												type="submit"
												onClick={() => this.onSend(submit)}
											/>
										</div>
									</Form>
								</div>
							</FocusLock>
						</Modal>
					)
				}
			</TransactionScenario>
		);
	}

}

ModalToWhitelist.propTypes = {
	activeAccount: PropTypes.object,
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	fees: PropTypes.array.isRequired,
	fee: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	assets: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransactionFee: PropTypes.func.isRequired,
	replenishContractPool: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalToWhitelist.defaultProps = {
	activeAccount: null,
	show: false,
	currency: null,
};

export default injectIntl(connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		fee: state.form.getIn([FORM_REPLENISH, 'fee']),
		activeAccount: state.global.get('activeUser'),
		show: state.modal.getIn([MODAL_REPLENISH, 'show']),
		assets: state.form.getIn([FORM_REPLENISH, 'balance']).assets,
		amount: state.form.getIn([FORM_REPLENISH, 'amount']),
		currency: state.form.getIn([FORM_REPLENISH, 'currency']),
		isAvailableBalance: state.form.getIn([FORM_REPLENISH, 'isAvailableBalance']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_REPLENISH)),
		setValue: (field, value) => dispatch(setValue(FORM_REPLENISH, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_REPLENISH, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_REPLENISH, field, error)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_REPLENISH, value, currency, name)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_REPLENISH)),
		getTransactionFee: (asset) => dispatch(getContractPoolBalanceFee(FORM_REPLENISH, asset)),
		replenishContractPool: () => dispatch(replenishContractPool()),
	}),
)(ModalToWhitelist));

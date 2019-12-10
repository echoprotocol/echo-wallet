import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { closeModal, setError } from '../../actions/ModalActions';
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


	componentDidMount() {

	}
	onClose(e) {
		this.props.setValue('amount', {
			...this.props.amount,
			value: '',
		});
		e.preventDefault();
		this.props.closeModal();
	}

	onSend(submit) {
		submit();
	}

	onChangeFeePoolValue(val, cur, name) {
		this.props.amountInput(val, cur, name);
		if (val && this.props.error) {
			this.props.setModalError('');
		}
	}
	render() {
		const {
			show, activeAccount, isAvailableBalance, currency, amount, assets, fee, fees, error,
		} = this.props;

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
									<h3 className="modal-header-title">Replenish Fee Pool</h3>
								</div>
								<div className="modal-body">
									<Form className="main-form">
										<div className="field-wrap">

											{
												activeAccount ?
													<AccountField
														subject="from"
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
												amount={{
													...amount,
													error,
												}}
												currency={currency}
												isAvailableBalance={isAvailableBalance}
												amountInput={(val, cur, name) => {
													this.onChangeFeePoolValue(val, cur, name);
												}}
												setFormError={this.props.setFormError}
												setFormValue={this.props.setFormValue}
												setValue={this.props.setValue}
												setDefaultAsset={this.props.setDefaultAsset}
												getTransferFee={this.props.getTransactionFee}
												setContractFees={() => {}}
												autoFocus
											/>
										</div>

										<div className="form-panel">
											<Button
												className="main-btn"
												content="Send"
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
	error: PropTypes.string,
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
	setModalError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransactionFee: PropTypes.func.isRequired,
	replenishContractPool: PropTypes.func.isRequired,
};

ModalToWhitelist.defaultProps = {
	activeAccount: null,
	show: false,
	currency: null,
	error: null,
};

export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		fee: state.form.getIn([FORM_REPLENISH, 'fee']),
		activeAccount: state.global.get('activeUser'),
		show: state.modal.getIn([MODAL_REPLENISH, 'show']),
		error: state.modal.getIn([MODAL_REPLENISH, 'error']),
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
		setModalError: (err) => dispatch(setError(MODAL_REPLENISH, err)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_REPLENISH, value, currency, name)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_REPLENISH)),
		getTransactionFee: (asset) => dispatch(getContractPoolBalanceFee(FORM_REPLENISH, asset)),
		replenishContractPool: () => dispatch(replenishContractPool()),
	}),
)(ModalToWhitelist);

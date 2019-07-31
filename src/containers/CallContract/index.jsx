import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import TransactionScenario from '../TransactionScenario';
import AmountField from '../../components/Fields/AmountField';

import { FORM_CALL_CONTRACT_VIA_ID, FORM_TRANSFER } from '../../constants/FormConstants';

import { setFormValue, clearForm, setFormError, setValue } from '../../actions/FormActions';
import { callContractViaId, getTransferFee } from '../../actions/TransactionActions';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setContractFees } from '../../actions/ContractActions';

class AddContractComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onInput(e) {
		this.props.setFormValue(e.target.name, e.target.value.trim());
		if (e.target.name === 'bytecode') this.props.setContractFees();
	}

	render() {
		const {
			bytecode, id, fee, tokens, assets, amount, currency, isAvailableBalance, fees,
		} = this.props;

		return (
			<TransactionScenario handleTransaction={() => this.props.callContract()}>
				{
					(submit) => (
						<Form className="main-form">
							<div className="form-info">
								<h3>Call contract via ID</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: id.error })}>
									<label htmlFor="id">ID</label>
									<input
										type="text"
										placeholder="Contract ID"
										name="id"
										className="ui input"
										value={id.value}
										onChange={(e) => this.onInput(e)}
										autoFocus
									/>
									<span className="error-message">{id.error}</span>
								</Form.Field>
								<Form.Field className={classnames('error-wrap', { error: bytecode.error })}>
									<label htmlFor="bytecode">Bytecode</label>
									<textarea
										placeholder="Bytecode"
										name="bytecode"
										className="ui input"
										value={bytecode.value}
										onChange={(e) => this.onInput(e)}
									/>
									<span className="error-message">{bytecode.error}</span>
								</Form.Field>
								<AmountField
									form={FORM_CALL_CONTRACT_VIA_ID}
									fee={fee}
									fees={fees}
									assets={assets}
									tokens={tokens}
									amount={amount}
									currency={currency}
									isAvailableBalance={isAvailableBalance}
									amountInput={this.props.amountInput}
									setFormError={this.props.setFormError}
									setFormValue={this.props.setFormValue}
									setValue={this.props.setValue}
									getTransferFee={this.props.getTransferFee}
									setDefaultAsset={this.props.setDefaultAsset}
									setContractFees={this.props.setContractFees}
								/>
							</div>

							<Button
								basic
								type="button"
								className="main-btn"
								onClick={submit}
								content="Call Contract"
							/>
						</Form>
					)
				}
			</TransactionScenario>
		);
	}

}

AddContractComponent.propTypes = {
	fees: PropTypes.array.isRequired,
	fee: PropTypes.object,
	tokens: PropTypes.object,
	assets: PropTypes.object,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	id: PropTypes.object.isRequired,
	bytecode: PropTypes.object.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	clearForm: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	callContract: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
};

AddContractComponent.defaultProps = {
	tokens: null,
	assets: null,
	fee: null,
	currency: null,
};


export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		id: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'id']),
		bytecode: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'bytecode']),
		tokens: state.balance.get('tokens'),
		assets: state.balance.get('assets'),
		amount: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'amount']),
		fee: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'fee']),
		currency: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'currency']),
		isAvailableBalance: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'isAvailableBalance']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_CALL_CONTRACT_VIA_ID)),
		callContract: () => dispatch(callContractViaId()),
		setValue: (field, value) => dispatch(setValue(FORM_CALL_CONTRACT_VIA_ID, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CALL_CONTRACT_VIA_ID, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, field, error)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_CALL_CONTRACT_VIA_ID)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_CALL_CONTRACT_VIA_ID, value, currency, name)),
		setContractFees: () => dispatch(setContractFees(FORM_CALL_CONTRACT_VIA_ID)),
		getTransferFee: () => dispatch(getTransferFee(FORM_TRANSFER)),
	}),
)(AddContractComponent);

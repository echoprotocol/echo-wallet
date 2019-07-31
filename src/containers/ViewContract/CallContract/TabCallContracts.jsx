import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import SelectMethod from './SelectMethod';
import ButtonComponent from './ButtonComponent';
import Field from './FieldComponent';
import AmountField from '../../../components/Fields/AmountField';
import FeeField from '../../../components/Fields/FeeField';

import { FORM_CALL_CONTRACT, FORM_TRANSFER } from '../../../constants/FormConstants';

import { clearForm, setFormError, setFormValue, setValue } from '../../../actions/FormActions';
import { getTransferFee } from '../../../actions/TransactionActions';
import { amountInput, setDefaultAsset } from '../../../actions/AmountActions';
import { setContractFees } from '../../../actions/ContractActions';

class TabCallContracts extends React.Component {

	componentDidMount() {
		this.props.setDefaultAsset();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.currency && prevProps.currency !== this.props.currency) {
			this.props.setDefaultAsset();
		}
	}

	renderFields(functionForm, functions) {
		const targetFunction = functions.find((f) => f.name === functionForm.get('functionName'));
		return targetFunction ?
			targetFunction.inputs.map(({ name, type }) => (
				<Field key={name} field={name} type={type} />
			)) :
			Object.keys(functionForm.get('inputs').toJS()).map((key) => (
				<Field key={key} field={key} type="()" />
			));
	}

	renderAmount(functionForm) {
		const {
			fee, tokens, amount, currency, assets, isAvailableBalance, fees,
		} = this.props;
		const payable = functionForm.get('payable');
		const functionName = functionForm.get('functionName');

		if (functionName) {
			return payable ?
				<AmountField
					form={FORM_CALL_CONTRACT}
					fee={fee}
					fees={fees}
					tokens={tokens}
					amount={amount}
					currency={currency}
					assets={assets}
					isAvailableBalance={isAvailableBalance}
					amountInput={this.props.amountInput}
					setFormError={this.props.setFormError}
					setFormValue={this.props.setFormValue}
					setValue={this.props.setValue}
					getTransferFee={this.props.getTransferFee}
					setDefaultAsset={this.props.setDefaultAsset}
					setContractFees={this.props.setContractFees}
				/>
				:
				<FeeField
					assets={assets.toJS()}
					form={FORM_CALL_CONTRACT}
					isSingle
					feeLabel="contract"
					type="call_contract"
					fee={fee}
					fees={fees}
					setValue={this.props.setValue}
					setFormValue={this.props.setFormValue}
					getTransferFee={this.props.getTransferFee}
					setContractFees={this.props.setContractFees}
				/>;
		}
		return null;
	}

	render() {
		const { functionForm, functions } = this.props;

		return (
			<div className="tab-content">

				<Form className="main-form">

					<div className="field-wrap">
						<SelectMethod />
						{
							this.renderFields(functionForm, functions)
						}
						{
							this.renderAmount(functionForm)
						}
						<ButtonComponent />
					</div>
				</Form>
			</div>
		);
	}

}

TabCallContracts.propTypes = {
	functionForm: PropTypes.object.isRequired,
	functions: PropTypes.object.isRequired,
	fee: PropTypes.object,
	fees: PropTypes.array.isRequired,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
};

TabCallContracts.defaultProps = {
	currency: null,
	fee: null,
};

export default connect(
	(state) => ({
		functionForm: state.form.get(FORM_CALL_CONTRACT),
		functions: state.contract.get('functions'),
		tokens: state.balance.get('tokens'),
		assets: state.balance.get('assets'),
		amount: state.form.getIn([FORM_CALL_CONTRACT, 'amount']),
		fee: state.form.getIn([FORM_CALL_CONTRACT, 'fee']),
		fees: state.fee.toArray() || [],
		currency: state.form.getIn([FORM_CALL_CONTRACT, 'currency']),
		isAvailableBalance: state.form.getIn([FORM_CALL_CONTRACT, 'isAvailableBalance']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_CALL_CONTRACT)),
		setValue: (field, value) => dispatch(setValue(FORM_CALL_CONTRACT, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CALL_CONTRACT, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_CALL_CONTRACT, field, error)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_CALL_CONTRACT)),
		getTransferFee: (asset) => dispatch(getTransferFee(FORM_TRANSFER, asset)),
		setContractFees: () => dispatch(setContractFees(FORM_TRANSFER)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_CALL_CONTRACT, value, currency, name)),
	}),
)(TabCallContracts);

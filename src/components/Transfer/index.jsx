import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import TransactionScenario from '../../containers/TransactionScenario';
import AccountField from '../Fields/AccountField';
import AmountField from '../Fields/AmountField';

class Transfer extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	render() {
		const {
			from, to, currency,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.transfer()}
			>
				{
					(submit) => (
						<Form className="main-form">
							<div className="form-info">
								<h3>Create Payment</h3>
							</div>
							<div className="field-wrap">
								<AccountField
									currency={currency}
									subject="from"
									field={from}
									checkAccount={this.props.checkAccount}
									setIn={this.props.setIn}
									setFormValue={this.props.setFormValue}
									getTransferFee={this.props.getTransferFee}
									setContractFees={this.props.setContractFees}
									setValue={this.props.setValue}
									disabled={true}
								/>
								<AccountField
									currency={currency}
									subject="to"
									field={to}
									autoFocus
									checkAccount={this.props.checkAccount}
									setIn={this.props.setIn}
									setFormValue={this.props.setFormValue}
									getTransferFee={this.props.getTransferFee}
									setContractFees={this.props.setContractFees}
									setValue={this.props.setValue}
								/>
								<AmountField
									fees={fees}
									form={FORM_TRANSFER}
									fee={fee}
									assets={assets}
									tokens={tokens}
									amount={amount}
									currency={currency}
									isAvailableBalance={isAvailableBalance}
									amountInput={this.props.amountInput}
									setFormError={this.props.setFormError}
									setFormValue={this.props.setFormValue}
									setValue={this.props.setValue}
									setDefaultAsset={this.props.setDefaultAsset}
									getTransferFee={this.props.getTransferFee}
									setContractFees={this.props.setContractFees}
								/>
								<div className="form-panel">
									<Button
										basic
										type="submit"
										className="main-btn"
										content="Send"
										onClick={submit}
									/>
								</div>
							</div>
						</Form>
					)
				}
			</TransactionScenario>
		);
	}

}

Transfer.propTypes = {
	fees: PropTypes.array.isRequired,
	from: PropTypes.object.isRequired,
	to: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	currency: PropTypes.object,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.any.isRequired,
	amount: PropTypes.object.isRequired,
	fee: PropTypes.object.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

Transfer.defaultProps = {
	currency: null,
};


export default Transfer;

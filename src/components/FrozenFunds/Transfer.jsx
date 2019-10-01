import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Button, Form } from 'semantic-ui-react';

import { FORM_FREEZE } from '../../constants/FormConstants';

import TransactionScenario from '../../containers/TransactionScenario';
import AmountField from '../Fields/AmountField';

const dateOptions = [
	{
		key: '3_month',
		text: '3 month',
		value: 90,
	},
	{
		key: '6_month',
		text: '6 month',
		value: 180,
	},
	{
		key: '12_month',
		text: '12 month',
		value: 360,
	},
];

class Transfer extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	onDropdownChange(e, value) {
		console.log(value);
		this.props.setValue('duration', value);
	}

	render() {
		const {
			currency,
			fee, assets, tokens, amount, isAvailableBalance, fees, duration,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.transfer()}
			>
				{
					(submit) => (
						<Form className="main-form">
							<div className="form-info">
								<h3>Freeze Funds</h3>
							</div>
							<div className="field-wrap">
								<AmountField
									fees={fees}
									form={FORM_FREEZE}
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
									getTransferFee={this.props.getTransactionFee}
									setContractFees={this.props.setContractFees}
									assetDropdown={false}
									labelText="Amount, ECHO"
								/>
								<Form.Field>
									<label htmlFor="period">Period</label>
									<Dropdown
										onChange={(e, { value }) => this.onDropdownChange(e, value)}
										text={duration}
										selection
										options={dateOptions}
										noResultsMessage="No results are found"
										// value={duration}
									// onClose={(e) => this.onCloseDropdown(e)}
									/>
								</Form.Field>
								<div className="form-panel">
									<div className="coefficient-value">
										<span>Coefficient:</span>
										<span>0.05</span>

										<div className="inner-tooltip-wrap">
											<span className="inner-tooltip-trigger icon-info" />
											<div className="inner-tooltip">This is the value that will be used to re-calculate a new sum after unfreezing.</div>
										</div>
									</div>
								</div>
								<div className="form-panel">
									<Button
										basic
										type="submit"
										className="main-btn"
										content="Freeze"
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
	duration: PropTypes.number.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
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
	getTransactionFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

Transfer.defaultProps = {
	currency: null,
};


export default Transfer;

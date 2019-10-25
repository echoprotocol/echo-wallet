import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Button, Form, Popup } from 'semantic-ui-react';

import { FORM_FREEZE } from '../../constants/FormConstants';
import { FREEZE_BALANCE_PARAMS } from '../../constants/GlobalConstants';

import TransactionScenario from '../../containers/TransactionScenario';
import AmountField from '../Fields/AmountField';

const dateOptions = FREEZE_BALANCE_PARAMS
	.map(({ duration, durationText }) => ({ value: duration, text: durationText }));

class Transfer extends React.Component {

	componentDidMount() {
		this.props.setAssets();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.activeUserId !== this.props.activeUserId) {
			this.props.setAssets();
		}
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
		this.props.setAssets();
	}

	onDropdownChange(e, value) {
		const currentDuration = dateOptions.find((d) => d.value === value);
		this.props.setValue('duration', Object.assign({}, currentDuration, { isSelected: true }));
	}

	render() {
		const {
			currency,
			fee, assets, tokens, amount, isAvailableBalance, fees, duration,
		} = this.props;
		let coefficient = '0.0';
		if (duration) {
			({ coefficientText: coefficient } = FREEZE_BALANCE_PARAMS
				.find((b) => b.duration === duration.value));
		}
		return (
			<TransactionScenario
				handleTransaction={() => this.props.freezeBalance()}
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
									setContractFees={() => { }}
									assetDropdown={false}
									labelText="Amount"
								/>
								<Form.Field>
									<label htmlFor="period">Period</label>
									<Dropdown
										onChange={(e, { value }) => this.onDropdownChange(e, value)}
										placeholder="Choose period"
										selection
										options={dateOptions}
										noResultsMessage="No results are found"
									/>
								</Form.Field>
								<div className="form-panel">
									{duration.isSelected ?
										<React.Fragment>
											<div className="coefficient-value">

												<span>Coefficient:</span>
												<span>{coefficient}</span>

												<Popup
													trigger={<span className="inner-tooltip-trigger icon-info" />}
													content="This is the value that will be used to re-calculate a new sum after unfreezing."
													className="inner-tooltip"
													inverted
												/>
											</div>
										</React.Fragment>
										:
										null
									}
									<Button
										basic
										type="submit"
										className="main-btn"
										content="Freeze"
										onClick={submit}
										disabled={!duration.isSelected}
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
	duration: PropTypes.object.isRequired,
	activeUserId: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	freezeBalance: PropTypes.func.isRequired,
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
	setAssets: PropTypes.func.isRequired,
};

Transfer.defaultProps = {
	currency: null,
};


export default Transfer;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';

import { Dropdown, Button, Popup, Form } from 'semantic-ui-react';

import { FORM_FREEZE } from '../../constants/FormConstants';
import { FREEZE_BALANCE_PARAMS } from '../../constants/GlobalConstants';

import TransactionScenario from '../../containers/TransactionScenario';
import AmountField from '../Fields/AmountField';


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


	resetForm() {
		this.props.clearForm();
		this.props.setDefaultAsset();
	}

	render() {
		const dateOptions = FREEZE_BALANCE_PARAMS
			.map(({ duration, durationText }) => ({
				value: duration,
				text: durationText,
				onClick: () => {
					const currentDuration = {
						value: duration,
						text: durationText,
						isSelected: true,
					};
					this.props.setValue('duration', currentDuration);
				},
			}));

		const {
			currency, intl, keyWeightWarn, fee, assets,
			tokens, amount, isAvailableBalance, fees, duration,
		} = this.props;
		let coefficient = '0.0';
		const popupMsg = intl.formatMessage({ id: 'wallet_page.frozen_funds.frozen_funds_list.popup_text' });
		const dropdownPlaceholder = intl.formatMessage({ id: 'wallet_page.frozen_funds.period_input_placeholder' });
		if (duration) {
			({ coefficientText: coefficient } = FREEZE_BALANCE_PARAMS
				.find((b) => b.duration === duration.value));
		}
		return (
			<TransactionScenario
				handleTransaction={() => this.props.freezeBalance()}
				onSend={() => this.resetForm()}
			>
				{
					(submit) => (
						<Form className="main-form">
							<div className="form-info">
								<h3>
									<FormattedMessage id="wallet_page.frozen_funds.subtitle" />
								</h3>
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
									intl={intl}
								/>
								<div className="field">
									<label htmlFor="period">
										<FormattedMessage id="wallet_page.frozen_funds.period_input_title" />
									</label>
									<Dropdown
										className={classnames('frozen-period-dropdown', { pl: !duration.isSelected })}
										text={duration.isSelected ? duration.text : dropdownPlaceholder}
										selection
										options={dateOptions}
										noResultsMessage="No results are found"
									/>
								</div>
								<div className="form-panel">
									{duration.isSelected &&
										<React.Fragment>
											<div className="coefficient-value">

												<span>
													<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.coefficient_text" />
												</span>
												<span>{coefficient}</span>

												<Popup
													trigger={<span className="inner-tooltip-trigger icon-info" />}
													content={popupMsg}
													className="inner-tooltip"
													style={{ width: 336, marginBottom: 20 }}
													inverted
												/>
											</div>
										</React.Fragment>
									}
									<Button
										type="submit"
										className="main-btn"
										content={
											<FormattedMessage id="wallet_page.frozen_funds.button_text" />
										}
										onClick={submit}
										disabled={!duration.isSelected || keyWeightWarn}
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
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

Transfer.defaultProps = {
	currency: null,
};


export default injectIntl(Transfer);

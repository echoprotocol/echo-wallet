import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import { List } from 'immutable';
import { FormattedMessage, injectIntl } from 'react-intl';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import TransactionScenario from '../../containers/TransactionScenario';
import AccountField from '../Fields/AccountField';
import AmountField from '../Fields/AmountField';
import BytecodeField from '../Fields/BytecodeField';
import { CONTRACT_ID_SUBJECT_TYPE } from '../../constants/TransferConstants';
import { STABLE_COINS } from '../../constants/SidechainConstants';

class Transfer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			bytecodeVisible: false,
		};
	}


	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	setVisibility(field, isVisible) {
		if (field === 'bytecode') {
			this.setState({
				bytecodeVisible: isVisible,
			});
		}
	}

	getAssets() {
		const { assets, activeCoinTypeTab } = this.props;

		if (activeCoinTypeTab === STABLE_COINS.EBTC) {
			return assets.filter((asset) => asset.symbol === STABLE_COINS.EBTC);
		} else if (activeCoinTypeTab === STABLE_COINS.EETH) {
			return assets.filter((asset) => asset.symbol === STABLE_COINS.EETH);
		}

		return assets;
	}

	getTokens() {
		const { tokens, activeCoinTypeTab, subjectTransferType } = this.props;

		if (subjectTransferType === CONTRACT_ID_SUBJECT_TYPE || activeCoinTypeTab) {
			return new List([]);
		}

		return tokens;
	}

	getToPlaceholder() {
		const { activeCoinTypeTab } = this.props;

		if (activeCoinTypeTab === STABLE_COINS.EBTC) {
			return 'wallet_page.create_payment.to_input.placeholder_v2';
		} else if (activeCoinTypeTab === STABLE_COINS.EETH) {
			return 'wallet_page.create_payment.to_input.placeholder_v3';
		}

		return 'wallet_page.create_payment.to_input.placeholder';
	}

	async subjectToSendSwitch(subject) {
		const { amount, fee } = this.props;
		if (amount.value && !fee.amount) {
			this.props.getTransferFee().then((resFee) => resFee && this.props.setValue('fee', resFee));
		} else if (!amount.value) {
			this.switchFeeToDefaultValue();
		}

		return this.props.subjectToSendSwitch(subject);
	}

	switchFeeToDefaultValue() {
		this.props.setValue('fee', {
			value: '',
			asset: null,
			error: null,
		});
	}

	render() {
		const {
			from, to, currency, additionalAccountInfo, intl,
			fee, amount, isAvailableBalance, fees, bytecode, avatarName,
		} = this.props;
		const { bytecodeVisible } = this.state;

		const additionalAccountPrefix = additionalAccountInfo.prefix ?
			intl.formatMessage({ id: additionalAccountInfo.prefix }) : '';
		return (
			<TransactionScenario
				handleTransaction={() => this.props.transfer()}
			>
				{
					(submit) => (
						<Form className="main-form">
							<div className="field-wrap">
								<AccountField
									currency={currency}
									subject="from"
									field={from}
									checkAccount={this.props.checkAccount}
									setFormValue={this.props.setFormValue}
									setIn={this.props.setIn}
									getTransferFee={this.props.getTransferFee}
									setContractFees={this.props.setContractFees}
									setValue={this.props.setValue}
									label={intl.formatMessage({ id: 'wallet_page.create_payment.from_input.title' })}
									placeholder={intl.formatMessage({ id: 'wallet_page.create_payment.from_input.placeholder' })}
								/>

								<AccountField
									showAdditionalAccountInfo
									additionalAccountInfo={additionalAccountInfo.value}
									additionalAccountPrefix={additionalAccountPrefix}
									currency={currency}
									subject="to"
									field={to}
									avatarName={avatarName}
									activeCoinTypeTab={this.props.activeCoinTypeTab}
									autoFocus
									subjectToSendSwitch={(value) => this.subjectToSendSwitch(value)}
									setTransferFee={this.props.setTransferFee}
									setFormValue={this.props.setFormValue}
									setIn={this.props.setIn}
									getTransferFee={this.props.getTransferFee}
									setContractFees={this.props.setContractFees}
									setValue={this.props.setValue}
									setVisibility={(field, isVisible) => this.setVisibility(field, isVisible)}
									label={intl.formatMessage({ id: 'wallet_page.create_payment.to_input.title' })}
									placeholder={intl.formatMessage({ id: this.getToPlaceholder() })}
								/>
								{
									bytecodeVisible &&
									<BytecodeField
										optional
										field={bytecode}
										setIn={this.props.setIn}
									/>
								}
								<AmountField
									fees={fees}
									form={FORM_TRANSFER}
									fee={fee}
									assets={this.getAssets()}
									tokens={this.getTokens()}
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
									setTransferFee={this.props.setTransferFee}
									isDisplaySidechainNotification={this.props.isDisplaySidechainNotification}
									activeCoinTypeTab={this.props.activeCoinTypeTab}
									intl={intl}
								/>
								<div className="form-panel">
									<Button
										basic
										type="submit"
										className="main-btn"
										content={
											<FormattedMessage id="wallet_page.create_payment.button_text" />
										}
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
	isDisplaySidechainNotification: PropTypes.bool,
	from: PropTypes.object.isRequired,
	to: PropTypes.object.isRequired,
	avatarName: PropTypes.string.isRequired,
	subjectTransferType: PropTypes.string.isRequired,
	bytecode: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	activeCoinTypeTab: PropTypes.any,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	additionalAccountInfo: PropTypes.object,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	subjectToSendSwitch: PropTypes.func.isRequired,
	setTransferFee: PropTypes.func.isRequired,
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
	intl: PropTypes.any.isRequired,
};

Transfer.defaultProps = {
	currency: null,
	isDisplaySidechainNotification: false,
	additionalAccountInfo: '',
	activeCoinTypeTab: 0,
};


export default injectIntl(Transfer);

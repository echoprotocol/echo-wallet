import React from 'react';
import PropTypes from 'prop-types';
import BN from 'bignumber.js';
import { Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import AddressField from '../Fields/AddressField';
import QrCode from '../QrCode/btc';

import { MODAL_GENERATE_ADDRESS } from '../../constants/ModalConstants';

class Bitcoin extends React.Component {

	componentDidMount() {
		this.props.getBtcAddress();
	}

	formatAmount() {
		const { amount, currency } = this.props;
		if (!currency || !currency.precision || !amount || !amount.value) {
			return null;
		}

		return new BN(amount.value).times(new BN(10).pow(currency.precision)).toString(10);
	}

	renderPayment() {

		const {
			currency,
			fee, assets, tokens, amount, isAvailableBalance, fees, accountName, btcAddress,
		} = this.props;

		return (
			<React.Fragment>
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>

				<AddressField
					address={btcAddress.address}
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
					assetDropdown
				/>
				{
					accountName ?
						<QrCode
							address={btcAddress.address}
							amount={this.formatAmount()}
						/> : null
				}
			</React.Fragment>
		);
	}

	renderGenerateAdressProcess() {
		const { btcAddress } = this.props;

		return btcAddress && btcAddress.address ? (
			<React.Fragment>
				<h2 className="payment-header t-center">
					You should generate address<br /> to receive payment.
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
				<Button
					className="main-btn"
					content="Generate address"
					onClick={() => this.props.openModal(MODAL_GENERATE_ADDRESS)}
				/>
			</React.Fragment>
		) :
			<React.Fragment>
				<h2 className="payment-header t-center">
					Wait please, <br /> address is not ready yet
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
			</React.Fragment>;
	}

	render() {
		const { btcAddress } = this.props;

		return (
			<div className="payment-wrap" >
				{
					btcAddress && btcAddress.address ?
						this.renderPayment() : this.renderGenerateAdressProcess()
				}
			</div>
		);
	}

}

Bitcoin.propTypes = {
	fees: PropTypes.array.isRequired,
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
	// eslint-disable-next-line react/no-unused-prop-types
	accountAddresses: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	openModal: PropTypes.func.isRequired,
	getBtcAddress: PropTypes.func.isRequired,
	btcAddress: PropTypes.object,
};

Bitcoin.defaultProps = {
	currency: null,
	btcAddress: null,
};


export default Bitcoin;

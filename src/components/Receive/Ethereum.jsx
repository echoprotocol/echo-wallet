import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import AccountField from '../Fields/AccountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';


class Ethereum extends React.Component {

	renderPayment() {

		const {
			currency, from, setIn, checkAccount,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		return (
			<React.Fragment>
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>

				<AccountField
					disabled
					field={from}
					currency={currency}
					subject="from"
					checkAccount={checkAccount}
					setIn={setIn}
					setFormValue={this.props.setFormValue}
					getTransferFee={this.props.getTransferFee}
					setContractFees={this.props.setContractFees}
					setValue={this.props.setValue}
				/>

				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>

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
					assetDropdown={false}
				/>
				<QrCode />
			</React.Fragment>
		);
	}
	renderGenerateAddressProcess() {
		const { address, generateEthAddress } = this.props;

		return address ? (
			<React.Fragment>
				<h2 className="payment-header t-center">
					You should generate address<br /> to receive payment.
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
				<TransactionScenario
					handleTransaction={() => generateEthAddress()}
				>
					{
						(submit) => (
							<Button
								className="main-btn"
								content="Generate address"
								onClick={submit}
							/>
						)
					}
				</TransactionScenario>
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


		return (
			<div className="payment-wrap" >
				{this.renderGenerateAddressProcess()}

				{/* {this.renderPayment()} */}
			</div>
		);
	}

}

Ethereum.propTypes = {
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
	from: PropTypes.object.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	address: PropTypes.bool,
	generateEthAddress: PropTypes.func.isRequired,
};

Ethereum.defaultProps = {
	currency: null,
	address: true,
};


export default Ethereum;

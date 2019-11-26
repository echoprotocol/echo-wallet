import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import AccountField from '../Fields/AccountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';


class Ethereum extends React.Component {

	componentDidMount() {
		this.props.getEthAddress();
	}

	componentDidUpdate(prevProps) {
		if (this.props.accountName !== prevProps.accountName) {
			this.props.getEthAddress();
		}
	}

	renderPayment() {

		const {
			currency, from, setIn, checkAccount, ethAddress,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		return (
			<React.Fragment>
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>

				<AccountField
					disabled
					field={{ value: ethAddress.get('address') }}
					checkAccount={() => {}}
					setIn={() => {}}
					setFormValue={() => {}}
					getTransferFee={() => {}}
					setContractFees={() => {}}
					setValue={() => {}}
				/>

				{/* <AccountField
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
				/> */}

				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>

				<AmountField
					fees={[]}
					form={FORM_TRANSFER}
					tokens={{ size: 0 }}
					amount={amount}
					isAvailableBalance={false}
					amountInput={this.props.amountInput}
					setFormError={() => {}}
					setFormValue={() => {}}
					setValue={() => {}}
					currency={{ precision: 18, id: '', symbol: 'ETH', balance: 0 }}
					setDefaultAsset={() => {}}
					getTransferFee={() => Promise.resolve()}
					setContractFees={() => {}}
					assetDropdown={false}
					showAvailable={false}
					labelText=""
				/>
				{/* <AmountField
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
				/> */}
				<QrCode />
			</React.Fragment>
		);
	}

	renderGenerateAddressProcess() {
		const { generateEthAddress } = this.props;

		return (
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
		);
	}

	renderWaitMessage() {
		return (
			<React.Fragment>
				<h2 className="payment-header t-center">
					Wait please, <br /> address is not ready yet
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
			</React.Fragment>
		);
	}

	render() {
		const { ethAddress } = this.props;
		console.log('render ', ethAddress);
		if (ethAddress.get('address') && ethAddress.get('isApproved') && ethAddress.get('isAddressGenerated')) {
			return this.renderPayment();
		} else if (ethAddress.get('isAddressGenerated')) {
			return this.renderWaitMessage();
		}

		return (
			<div className="payment-wrap" >
				{this.renderGenerateAddressProcess()}
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
	generateEthAddress: PropTypes.func.isRequired,
	getEthAddress: PropTypes.func.isRequired,
	ethAddress: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
};

Ethereum.defaultProps = {
	currency: null,
};


export default Ethereum;

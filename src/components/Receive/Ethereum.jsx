import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import BN from 'bignumber.js';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';


class Ethereum extends React.Component {

	componentDidMount() {
		this.props.getEthAddress();
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	renderPayment() {

		const { ethAddress, amount } = this.props;

		const ethCurrency = {
			precision: 18, id: '', symbol: 'ETH', balance: 0,
		};
		const address = ethAddress.get('eth_addr');

		const tmpValue = new BN(amount.value || 0);

		const value = tmpValue.isInteger() && !tmpValue.eq(0) ?
			tmpValue.toFixed(1).toString(10) : tmpValue.toString(10);

		const qrText = `ethereum:0x${address}?value=${value}`;

		return (
			<React.Fragment>
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>
				<Form.Field>
					<label htmlFor="public-key">address</label>
					<div className="ui action input">
						<input
							type="text"
							placeholder="Public Key"
							readOnly
							name="public-key"
							value={address}
						/>
						<CopyToClipboard text={address}>
							<Button icon="copy" className="input-copy-btn" />
						</CopyToClipboard>
					</div>
				</Form.Field>
				<AmountField
					fees={[]}
					form={FORM_ETH_RECEIVE}
					tokens={{ size: 0 }}
					amount={amount}
					isAvailableBalance={false}
					amountInput={this.props.amountInput}
					setFormError={() => {}}
					setFormValue={() => {}}
					setValue={() => {}}
					currency={ethCurrency}
					setDefaultAsset={() => {}}
					getTransferFee={() => Promise.resolve()}
					setContractFees={() => {}}
					assetDropdown={false}
					showAvailable={false}
					labelText="amount"
				/>
				<QrCode text={qrText} />
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
		const { ethAddress, fullCurrentAccount } = this.props;

		if (!fullCurrentAccount.getIn(['statistics', 'generated_eth_address'])) {
			return (
				<div className="payment-wrap" >
					{this.renderGenerateAddressProcess()}
				</div>
			);
		}

		if (ethAddress.get('eth_addr') && ethAddress.get('is_approved')) {
			return (
				<div className="payment-wrap" >
					{this.renderPayment()}
				</div>
			);
		}

		return (
			<div className="payment-wrap" >
				{this.renderWaitMessage()}
			</div>
		);
	}

}

Ethereum.propTypes = {
	amount: PropTypes.object.isRequired,
	amountInput: PropTypes.func.isRequired,
	generateEthAddress: PropTypes.func.isRequired,
	getEthAddress: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	ethAddress: PropTypes.object.isRequired,
	fullCurrentAccount: PropTypes.object.isRequired,
};

export default Ethereum;

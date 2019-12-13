import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import BN from 'bignumber.js';
import { FormattedMessage } from 'react-intl';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';
import ActionBtn from '../ActionBtn';


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
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.info" />
				</p>
				<Form.Field>
					<label htmlFor="public-key">
						<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.input_title" />
					</label>
					<div className="ui action input">
						<input
							type="text"
							placeholder="Public Key"
							readOnly
							name="public-key"
							value={address}
						/>
						<ActionBtn
							icon="icon-copy"
							copy={address}
						/>
					</div>
				</Form.Field>
				<AmountField
					fees={[]}
					form={FORM_ETH_RECEIVE}
					amount={amount}
					isAvailableBalance={false}
					amountInput={this.props.amountInput}
					setFormError={() => {}}
					setFormValue={() => {}}
					setValue={() => {}}
					currency={ethCurrency}
					setDefaultAsset={() => {}}
					assetDropdown={false}
					showAvailable={false}
					receive
					labelText="amount"
					warningMessage={
						<span className="warning-message">
							<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt1" />
							<span className="special">
								<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt2" />
							</span>
							<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt3" />
						</span>
					}
				/>
				<QrCode link={qrText} />
			</React.Fragment>
		);
	}

	renderGenerateAddressProcess() {
		const { generateEthAddress } = this.props;

		return (
			<React.Fragment>
				<h2 className="payment-header t-center">
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.title_pt1" />
					<br />
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.title_pt2" />
				</h2>
				<p className="payment-description t-center">
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.description" />
				</p>
				<TransactionScenario
					handleTransaction={() => generateEthAddress()}
				>
					{
						(submit) => (
							<Button
								className="main-btn"
								content={
									<FormattedMessage id="wallet_page.receive_payment.eth.no_address_page.button_text" />
								}
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
					<FormattedMessage id="wallet_page.receive_payment.eth.no_address_page.title_pt1" />
					<br />
					<FormattedMessage id="wallet_page.receive_payment.eth.no_address_page.title_pt2" />
				</h2>
				<p className="payment-description t-center">
					<FormattedMessage id="wallet_page.receive_payment.eth.no_address_page.description" />
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

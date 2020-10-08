import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import BN from 'bignumber.js';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';
import { BRIDGE_RECEIVE_URL } from '../../constants/GlobalConstants';
import { CHECK_BLOCK_INTERVAL } from '../../constants/SidechainConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';
import ActionBtn from '../ActionBtn';

import Interval from '../../helpers/Interval';

class Ethereum extends React.Component {

	componentDidMount() {
		this.checkConfirmation();
	}

	componentDidUpdate() {
		this.checkConfirmation();
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	getQrLink(address) {
		const { amount } = this.props;

		if (!address) {
			return '';
		}
		const link = `${BRIDGE_RECEIVE_URL}${address}/asset-1/${amount.value || null}/widget`;

		return link;
	}
	getQrData(address) {
		const { amount } = this.props;
		const tmpValue = new BN(amount.value || 0);

		const value = tmpValue.isInteger() && !tmpValue.eq(0) ?
			tmpValue.toFixed(1).toString(10) : tmpValue.toString(10);

		return +value ? `ethereum:${address}?value=${value}` : `ethereum:${address}`;
	}

	checkConfirmation() {
		const { ethSidechain, ethAddress, fullCurrentAccount } = this.props;
		// this.props.getEthAddress();

		if (ethAddress.get('eth_addr') && ethAddress.get('is_approved')) {
			Interval.stopInterval();
			return;
		}

		if (ethSidechain.get('confirmed')) {
			Interval.stopInterval();
			return;
		}

		if (Interval.instance) {
			return;
		}

		if (fullCurrentAccount.getIn(['statistics', 'created_eth_address'])) {
			Interval.makeInterval(() => this.props.getEthAddress(), CHECK_BLOCK_INTERVAL);
		}
	}

	renderPayment(address) {
		const { amount, intl, ethAddress } = this.props;

		const ethCurrency = {
			precision: 18, id: '', symbol: 'ETH', balance: 0,
		};

		const isNotAproved = !ethAddress.get('is_approved');
		const isAddressNotExist = !ethAddress.get('eth_addr');
		const link = this.getQrLink(address);
		const qrData = this.getQrData(address);

		return (
			<React.Fragment>
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.info" />
				</p>
				{isNotAproved && isAddressNotExist &&
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.wait_text" />
				</p>}
				<div className="field-wrap">
					<div className="field">
						<label htmlFor="public-key">
							<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.input_title" />
						</label>
						<div className="action input">
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
								labelText={intl.formatMessage({ id: 'copied_text' })}
							/>
						</div>
					</div>
					<AmountField
						fees={[]}
						form={FORM_ETH_RECEIVE}
						amount={amount}
						isAvailableBalance={false}
						amountInput={this.props.amountInput}
						setFormError={() => { }}
						setFormValue={() => { }}
						setValue={() => { }}
						currency={ethCurrency}
						setDefaultAsset={() => { }}
						assetDropdown={false}
						showAvailable={false}
						receive
						warningMessage={
							<span className="warning-message">
								<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt1" />
								<span className="special">
									<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt2" />
								</span>
								<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.warning_message_pt3" />
							</span>
						}
						intl={intl}
					/>
				</div>
				<QrCode
					link={link}
					qrData={qrData}
				/>
			</React.Fragment>
		);
	}

	renderGenerateAddressProcess() {
		const { generateEthAddress, keyWeightWarn } = this.props;

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
								disabled={keyWeightWarn}
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
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.title_pt1" />
					<br />
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.title_pt2" />
				</h2>
				<p className="payment-description t-center">
					<FormattedMessage id="wallet_page.receive_payment.eth.wait_address_page.description" />
				</p>
			</React.Fragment>
		);
	}

	render() {
		const { ethAddress, fullCurrentAccount, ethSidechain } = this.props;

		if (!fullCurrentAccount.getIn(['statistics', 'created_eth_address'])) {
			return (
				<div className="payment-wrap" >
					{this.renderGenerateAddressProcess()}
				</div>
			);
		}

		if (ethAddress.get('eth_addr') && ethAddress.get('is_approved')) {
			return (
				<div className="payment-wrap" >
					{this.renderPayment(`0x${ethAddress.get('eth_addr')}`)}
				</div>
			);
		}

		if (ethSidechain.get('address')) {
			return (
				<div className="payment-wrap" >
					{this.renderPayment(ethSidechain.get('address'))}
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
	ethSidechain: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

export default injectIntl(Ethereum);

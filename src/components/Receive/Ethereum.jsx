import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import BN from 'bignumber.js';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';
import { BRIDGE_RECEIVE_URL } from '../../constants/GlobalConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import TransactionScenario from '../../containers/TransactionScenario';
import ActionBtn from '../ActionBtn';

let interval = null;
class Ethereum extends React.Component {

	componentDidMount() {
		this.checkConfirmation();
	}

	componentDidUpdate() {
		this.checkConfirmation();
	}

	componentWillUnmount() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		this.props.clearForm();
	}

	getQrLink() {
		const {
			amount, ethAddress,
		} = this.props;
		const address = ethAddress.get('eth_addr');
		if (!address) {
			return '';
		}
		const ethLink = `ethereum:${address}`;
		const link = `${BRIDGE_RECEIVE_URL}${ethLink}/asset-1/${amount.value || null}/widget`;

		return link;
	}
	getQrData() {
		const { ethAddress, amount } = this.props;
		const tmpValue = new BN(amount.value || 0);
		const address = `0x${ethAddress.get('eth_addr')}`;

		const value = tmpValue.isInteger() && !tmpValue.eq(0) ?
			tmpValue.toFixed(1).toString(10) : tmpValue.toString(10);

		return +value ? `ethereum:${address}?value=${value}` : `ethereum:${address}`;
	}

	checkConfirmation() {
		const { ethSidechain } = this.props;
		this.props.getEthAddress();

		if (ethSidechain.get('confirmed')) {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			return;
		}

		if (interval) {
			return;
		}


		if (ethSidechain.get('address')) {
			interval = setInterval(() => this.props.getEthAddress(), 4000);
		}
	}

	renderPayment(address, warning) {
		const { ethAddress, amount, intl } = this.props;

		const ethCurrency = {
			precision: 18, id: '', symbol: 'ETH', balance: 0,
		};
		// const address = ethAddress.get('eth_addr');

		const addressWithPrefix = `0x${address}`;

		const link = this.getQrLink();
		const qrData = this.getQrData();

		return (
			<React.Fragment>
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.info" />
				</p>
				<div className="field-wrap">
					<div className="field">
						<label htmlFor="public-key">
							<FormattedMessage id="wallet_page.receive_payment.eth.complete_address_page.input_title" />
						</label>
						{
							warning && (
								<label htmlFor="public-key">
									Your address is yet not fully confirmed. Wait up to 5 minutes
								</label>
							)
						}
						<div className="action input">
							<input
								type="text"
								placeholder="Public Key"
								readOnly
								name="public-key"
								value={addressWithPrefix}
							/>
							<ActionBtn
								icon="icon-copy"
								copy={addressWithPrefix}
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

		console.log('eth_addr: ', ethAddress.get('eth_addr'));
		console.log('is_approved: ', ethAddress.get('is_approved'));
		console.log('ethSidechain: ', ethSidechain.toJS());
		// console.log('eth_addr: ', JSON.stringify(fullCurrentAccount.getIn(['statistics']).toJS()));

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
					{this.renderPayment(ethAddress.get('eth_addr'))}
				</div>
			);
		}

		if (ethSidechain.get('address')) {
			return (
				<div className="payment-wrap" >
					{this.renderPayment(ethSidechain.get('address'), !ethSidechain.get('confirmed'))}
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

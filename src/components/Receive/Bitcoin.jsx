import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { BRIDGE_RECEIVE_URL } from '../../constants/GlobalConstants';

import { FORM_BTC_RECEIVE } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import ModalCreateBtcAddress from '../Modals/ModalCreateBtcAddress';

import { MODAL_GENERATE_BTC_ADDRESS } from '../../constants/ModalConstants';
import ActionBtn from '../ActionBtn';

class Bitcoin extends React.Component {

	componentDidMount() {
		this.props.getBtcAddress();
	}

	getBtcAddressData() {
		const { btcAddress } = this.props;

		if (!btcAddress) {
			return null;
		}

		const address = btcAddress.getIn(['deposit_address', 'address']);
		const account = btcAddress.get('account');

		if (!address || !account) {
			return null;
		}

		return { address, account };
	}

	getQrData() {
		const {
			amount, btcAddress,
		} = this.props;
		const address = btcAddress.getIn(['deposit_address', 'address']);
		if (!address) {
			return '';
		}
		const btcLink = `bitcoin:${address}`;
		const link = `${BRIDGE_RECEIVE_URL}${btcLink}/asset-2/${amount.value || null}/widget`;

		return link;
	}

	renderPayment() {

		const {
			amount, accountName, btcAddress, intl,
		} = this.props;

		const link = this.getQrData();
		const address = btcAddress.getIn(['deposit_address', 'address']);

		return (
			<React.Fragment>
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.btc.complete_address_page.info" />
				</p>

				<Form.Field>
					<label htmlFor="public-key">
						<FormattedMessage id="wallet_page.receive_payment.btc.complete_address_page.input_title" />
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
					form={FORM_BTC_RECEIVE}
					tokens={{ size: 0 }}
					amount={amount}
					isAvailableBalance={false}
					amountInput={this.props.amountInput}
					setFormError={() => { }}
					setFormValue={() => { }}
					setValue={() => { }}
					currency={{
						precision: 8, id: '', symbol: 'BTC', balance: 0,
					}}
					setDefaultAsset={() => { }}
					getTransferFee={() => Promise.resolve()}
					setContractFees={() => { }}
					assetDropdown={false}
					showAvailable={false}
					warningMessage={
						<span className="warning-message">
							<FormattedMessage id="wallet_page.receive_payment.btc.complete_address_page.warning_message_pt1" />
							<span className="special">
								<FormattedMessage id="wallet_page.receive_payment.btc.complete_address_page.warning_message_pt2" />
							</span>
							<FormattedMessage id="wallet_page.receive_payment.btc.complete_address_page.warning_message_pt3" />
						</span>
					}
					intl={intl}
				/>
				{
					accountName && address && amount ?
						<QrCode
							link={link}
						/> : null
				}
			</React.Fragment>
		);
	}

	renderGenerateAddressProcess() {
		const { btcAddress, keyWeightWarn } = this.props;

		if (btcAddress && btcAddress.size && !btcAddress.getIn(['is_relevant'])) {
			return (
				<React.Fragment>
					<h2 className="payment-header t-center">
						<FormattedMessage id="wallet_page.receive_payment.btc.wait_address_page.title_pt1" />
						<br />
						<FormattedMessage id="wallet_page.receive_payment.btc.wait_address_page.title_pt2" />
					</h2>
					<p className="payment-description t-center">
						<FormattedMessage id="wallet_page.receive_payment.btc.wait_address_page.description" />
					</p>
				</React.Fragment>
			);
		}

		return (
			<React.Fragment>
				<ModalCreateBtcAddress />
				<h2 className="payment-header t-center">
					<FormattedMessage id="wallet_page.receive_payment.btc.no_address_page.title_pt1" />
					<br />
					<FormattedMessage id="wallet_page.receive_payment.btc.no_address_page.title_pt2" />
				</h2>
				<p className="payment-description t-center">
					<FormattedMessage id="wallet_page.receive_payment.btc.no_address_page.description" />
				</p>
				<Button
					className="main-btn"
					content={
						<FormattedMessage id="wallet_page.receive_payment.btc.no_address_page.button_text" />
					}
					disabled={keyWeightWarn}
					onClick={() => this.props.openModal(MODAL_GENERATE_BTC_ADDRESS)}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { accountId } = this.props;

		const btcAddressData = this.getBtcAddressData();

		return (
			<div className="payment-wrap" >
				{
					btcAddressData && btcAddressData.address && btcAddressData.account === accountId ?
						this.renderPayment() : this.renderGenerateAddressProcess()
				}
			</div>
		);
	}

}

Bitcoin.propTypes = {
	amount: PropTypes.object.isRequired,
	amountInput: PropTypes.func.isRequired,
	// eslint-disable-next-line react/no-unused-prop-types
	accountAddresses: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	accountId: PropTypes.string.isRequired,
	openModal: PropTypes.func.isRequired,
	getBtcAddress: PropTypes.func.isRequired,
	btcAddress: PropTypes.object,
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

Bitcoin.defaultProps = {
	btcAddress: null,
};


export default injectIntl(Bitcoin);

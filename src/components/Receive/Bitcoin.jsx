import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';

import { FORM_BTC_RECEIVE } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import ModalCreateBtcAddress from '../Modals/ModalCreateBtcAddress';

import { MODAL_GENERATE_BTC_ADDRESS } from '../../constants/ModalConstants';
import InputActionBtn from '../InputActionBtn';

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

	renderPayment() {

		const {
			amount, accountName, btcAddress,
		} = this.props;

		const address = btcAddress.getIn(['deposit_address', 'address']);

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
						<InputActionBtn copy={address} />
					</div>
				</Form.Field>

				<AmountField
					fees={[]}
					form={FORM_BTC_RECEIVE}
					tokens={{ size: 0 }}
					amount={amount}
					isAvailableBalance={false}
					amountInput={this.props.amountInput}
					setFormError={() => {}}
					setFormValue={() => {}}
					setValue={() => {}}
					currency={{
						precision: 8, id: '', symbol: 'BTC', balance: 0,
					}}
					setDefaultAsset={() => {}}
					getTransferFee={() => Promise.resolve()}
					setContractFees={() => {}}
					assetDropdown={false}
					showAvailable={false}
					labelText="amount"
				/>
				{
					accountName && address && amount ?
						<QrCode
							link={`bitcoin:${address}?amount=${amount.value}`}
						/> : null
				}
			</React.Fragment>
		);
	}

	renderGenerateAdressProcess() {
		const { btcAddress } = this.props;

		if (btcAddress && btcAddress.size && !btcAddress.getIn(['is_relevant'])) {
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

		return (
			<React.Fragment>
				<ModalCreateBtcAddress />
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
						this.renderPayment() : this.renderGenerateAdressProcess()
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
};

Bitcoin.defaultProps = {
	btcAddress: null,
};


export default Bitcoin;

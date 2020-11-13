import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';

import ModalCreateBtcStakeAddress from '../Modals/ModalCreateBtcStakeAddress';

import ActionBtn from '../ActionBtn';
import { MODAL_GENERATE_BTC_STAKE_ADDRESS } from '../../constants/ModalConstants';

class Bitcoin extends React.Component {

	componentDidMount() {
		this.props.getStakeBtcAddress();
	}

	getStakeBtcAddressData() {
		const { stakeBtcAddress } = this.props;

		if (!stakeBtcAddress) {
			return null;
		}

		const address = stakeBtcAddress.get('address');
		const account = stakeBtcAddress.get('account');

		if (!address || !account) {
			return null;
		}

		return { address, account };
	}

	renderPayment() {

		const {
			stakeBtcAddress, intl,
		} = this.props;

		const address = stakeBtcAddress.getIn(['deposit_address', 'address']);

		return (
			<React.Fragment>
				<p className="payment-description">
					<FormattedMessage id="wallet_page.stake.btc.complete_address_page.info" />
				</p>
				<div className="field-wrap">
					<div className="field">
						<label htmlFor="public-key">
							<FormattedMessage id="wallet_page.stake.btc.complete_address_page.input_title" />
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
				</div>
			</React.Fragment>
		);
	}

	renderGenerateAddressProcess() {
		const { keyWeightWarn } = this.props;

		return (
			<React.Fragment>
				<ModalCreateBtcStakeAddress />
				<h2 className="payment-header t-center">
					<FormattedMessage id="wallet_page.stake.btc.no_address_page.title_pt1" />
					<br />
					<FormattedMessage id="wallet_page.stake.btc.no_address_page.title_pt2" />
				</h2>
				<p className="payment-description t-center">
					<FormattedMessage id="wallet_page.stake.btc.no_address_page.description" />
				</p>
				<Button
					className="main-btn"
					content={
						<FormattedMessage id="wallet_page.stake.btc.no_address_page.button_text" />
					}
					disabled={keyWeightWarn}
					onClick={() => this.props.openModal(MODAL_GENERATE_BTC_STAKE_ADDRESS)}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { accountId } = this.props;

		const btcAddressData = this.getStakeBtcAddressData();

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
	accountId: PropTypes.string.isRequired,
	openModal: PropTypes.func.isRequired,
	getStakeBtcAddress: PropTypes.func.isRequired,
	stakeBtcAddress: PropTypes.object,
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

Bitcoin.defaultProps = {
	stakeBtcAddress: null,
};


export default injectIntl(Bitcoin);

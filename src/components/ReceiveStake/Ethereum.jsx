import React from 'react';
import PropTypes from 'prop-types';
import BN from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';

import ActionBtn from '../ActionBtn';


class Ethereum extends React.Component {

	renderPayment() {
		const {
			intl, accountId, globalProperties,
		} = this.props;

		const parameters = globalProperties.getIn(['parameters']) || { stake_sidechain_config: {} };
		const contractAddress = parameters.stake_sidechain_config.contract_address;
		const topicMethod = parameters.stake_sidechain_config.balance_updated_topic;

		const accountIdNumber = new BN(accountId.split('.')[2]).toString(16).padStart(64, '0');
		const data = `${topicMethod}${accountIdNumber}`;

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
						<div className="action input">
							<input
								type="text"
								placeholder="Public Key"
								readOnly
								name="public-key"
								value={contractAddress}
							/>
							<ActionBtn
								icon="icon-copy"
								copy={contractAddress}
								labelText={intl.formatMessage({ id: 'copied_text' })}
							/>
						</div>
					</div>
				</div>
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
								value={data}
							/>
							<ActionBtn
								icon="icon-copy"
								copy={data}
								labelText={intl.formatMessage({ id: 'copied_text' })}
							/>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="payment-wrap" >
				{this.renderPayment()}
			</div>
		);
	}

}

Ethereum.propTypes = {
	intl: PropTypes.any.isRequired,
	globalProperties: PropTypes.object.isRequired,
	accountId: PropTypes.string,
};

Ethereum.defaultProps = {
	accountId: '',
};

export default injectIntl(Ethereum);

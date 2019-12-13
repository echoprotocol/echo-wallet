import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';


import { formatAmount } from '../../helpers/FormatHelper';

class StableCoins extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	onStableClick(p, c) {
		this.props.setGlobalValue('activePaymentTypeTab', p);
		this.props.setGlobalValue('activeCoinTypeTab', c);
	}
	renderList() {
		const { activeCoinTypeTab, activePaymentTypeTab } = this.props;
		return (
			this.props.assets.map((asset, i) => {
				const id = i;
				return (
					<li key={id}>
						<div className="balance-item">
							<span className="currency-symbol">{asset.symbol}</span>
							<div className="currency-value">
								<span className="currency-amount">
									{formatAmount(asset.balance, asset.precision, '')}
								</span>
								<div className="balance-tags">
									<Button
										className={classnames('tag', {
											active: activeCoinTypeTab === i + 1 && activePaymentTypeTab === 1,
										})}
										content={
											<FormattedMessage id="wallet_page.balances.stable_coins.deposit" />
										}
										onClick={() => {
											this.onStableClick(1, i + 1);
										}}
									/>
									<Button
										className={classnames('tag', {
											active: activeCoinTypeTab === i + 1 && activePaymentTypeTab === 0,
										})}
										content={
											<FormattedMessage id="wallet_page.balances.stable_coins.withdrawal" />
										}
										disabled={!asset.notEmpty}
										onClick={() => {
											this.onStableClick(0, i + 1);
											this.props.setAsset(asset);
										}}
									/>
								</div>
							</div>
						</div>
					</li>
				);

			})
		);
	}

	render() {
		const { intl } = this.props;
		const popupMsg = intl.formatMessage({ id: 'wallet_page.balances.stable_coins.popup_info' });
		return (
			<React.Fragment>
				<h3 className="currency-title">
					<FormattedMessage id="wallet_page.balances.stable_coins.title" />
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content={popupMsg}
						className="inner-tooltip"
						style={{ width: 373 }}
						inverted
					/>
				</h3>
				<ul className="currency-list stable-coins">
					{ this.renderList() }
				</ul>
			</React.Fragment>
		);
	}

}

StableCoins.propTypes = {
	setAsset: PropTypes.func.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
	activePaymentTypeTab: PropTypes.number.isRequired,
	activeCoinTypeTab: PropTypes.number.isRequired,
	assets: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(StableCoins);

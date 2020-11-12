import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';


import { formatAmount } from '../../helpers/FormatHelper';
import { KEY_CODE_ENTER } from '../../constants/GlobalConstants';

class StableCoins extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focusedId: null,
		};
	}

	onFocus(id) {
		this.setState({ focusedId: id });
	}

	onBlur() {
		this.setState({ focusedId: null });
	}

	onStableClick(e, p, c) {
		e.preventDefault();
		e.stopPropagation();
		this.props.setGlobalValue('activePaymentTypeTab', p);
		this.props.setGlobalValue('activeCoinTypeTab', c);
	}

	onClickAsset(e, symbol) {
		this.selectAsset(symbol);
	}

	onPressAsset(e, symbol) {
		if (e.which === KEY_CODE_ENTER || e.keyCode === KEY_CODE_ENTER) {
			this.selectAsset(symbol);
		}
	}

	selectAsset(symbol) {
		this.props.setGlobalValue('activePaymentTypeTab', 0);
		this.props.setGlobalValue('activeCoinTypeTab', 0);
		this.props.setAsset(symbol);
	}

	renderList() {
		const { activeCoinTypeTab, activePaymentTypeTab } = this.props;
		return (
			this.props.assets.map((asset, i) => {
				const id = i;
				return (
					<li
						key={id}
						className={classnames({ focused: id === this.state.focusedId })}
					>
						<button
							className="balance-item"
							onFocus={() => this.onFocus(id)}
							onBlur={() => this.onBlur()}
							onClick={(e) => this.onClickAsset(e, asset)}
						>
							<span className="currency-symbol">{asset.symbol}</span>
							<div className="currency-value">
								<span className="currency-amount">
									{formatAmount(asset.balance, asset.precision)}
								</span>
								<div className="balance-tags">
									{
										asset.deposit && (
											<a
												href=""
												onClick={(e) => this.onStableClick(e, 1, asset.symbol)}
												className={classnames('tag', {
													active: activeCoinTypeTab === asset.symbol && activePaymentTypeTab === 1,
												})}
												content={
													<FormattedMessage id="wallet_page.balances.stable_coins.deposit" />
												}
											>Deposit
											</a>
										)
									}
									{
										asset.withdraw && (
											<a
												href=""
												onClick={(e) => {
													this.onStableClick(e, 0, asset.symbol);
													this.props.setAsset(asset);
												}}
												className={classnames('tag', {
													active: activeCoinTypeTab === asset.symbol && activePaymentTypeTab === 0,
												})}
												content={
													<FormattedMessage id="wallet_page.balances.stable_coins.withdrawal" />
												}
												disabled={!asset.notEmpty}
											>Withdrawal
											</a>
										)
									}
								</div>
							</div>
						</button>
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
	activeCoinTypeTab: PropTypes.any.isRequired,
	assets: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(StableCoins);

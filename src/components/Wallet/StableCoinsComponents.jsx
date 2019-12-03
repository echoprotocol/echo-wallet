import React from 'react';
// import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import { formatAmount } from '../../helpers/FormatHelper';

class StableCoins extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	renderList() {
		const stableCoins = [
			{
				symbol: 'eBTC',
				balance: '27599988512',
				precision: 8,
			},
			{
				symbol: 'eETH',
				balance: '38000000',
				precision: 8,
			},
		];
		return (
			stableCoins.map((asset, i) => {
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
										disabled // if balance 0
										className="tag"
										content="Deposit"
									/>
									<Button
										className="tag active"
										content="Withdrawal"
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
		return (
			<React.Fragment>
				<h3 className="currency-title">
					Stable Coins
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content="Coins from Sidechains, e.g. Bitcoin or Ethereum, converted to eBTC and eETH and burned back to BTC and ETH when withdrawing to an original sidechain."
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

StableCoins.propTypes = {};

export default StableCoins;

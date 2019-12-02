import React from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'semantic-ui-react';

import { formatAmount } from '../../helpers/FormatHelper';

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
					<li
						className={classnames({ focused: id === this.state.focusedId })}
						key={id}
					>
						<div className="balance-item">
							<span className="currency-symbol">{asset.symbol}</span>
							<div className="currency-value">
								<span className="currency-amount">
									{formatAmount(asset.balance, asset.precision, '')}
								</span>
								<div className="balance-tags">
									<Button
										onFocus={() => this.onFocus(id)}
										onBlur={() => this.onBlur()}
										className="tag"
										content="Deposit"
									/>
									<Button
										onFocus={() => this.onFocus(id)}
										onBlur={() => this.onBlur()}
										className="tag"
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
				<div className="currency-title">Stable Coins</div>
				<ul className="currency-list stable-coins">
					{ this.renderList() }
				</ul>
			</React.Fragment>
		);
	}

}

StableCoins.propTypes = {};

export default StableCoins;

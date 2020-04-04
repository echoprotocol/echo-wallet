import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { formatAmount } from '../../helpers/FormatHelper';

class Assets extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focusedId: null,
		};
	}

	componentDidMount() {
		this.props.setAssetActiveAccount();
	}
	onFocus(id) {
		this.setState({ focusedId: id });
	}

	onBlur() {
		this.setState({ focusedId: null });
	}

	setAsset(asset) {
		this.props.setGlobalValue('activeCoinTypeTab', 0);
		this.props.setAsset(asset);
	}

	renderItem(asset, id) {
		return (
			<li
				key={id}
				className={classnames({ focused: id === this.state.focusedId })}
			>
				<button
					className="balance-item"
					onFocus={() => this.onFocus(id)}
					onBlur={() => this.onBlur()}
					onClick={() => this.setAsset(asset)}
				>
					<span className="currency-symbol">{asset.symbol}</span>
					<span className="currency-amount">
						{formatAmount(asset.balance, asset.precision, '')}
					</span>
				</button>
			</li>
		);
	}

	renderEmpty() {
		return this.renderItem({ symbol: 'ECHO', balance: '0', precision: 8 }, 0);
	}

	renderList() {

		return (
			this.props.assets.map((asset, i) => {
				const id = i;
				return this.renderItem(asset, id);
			})
		);
	}

	render() {
		return (
			<ul className="currency-list">
				{
					!this.props.assets || !this.props.assets.size ?
						this.renderEmpty() : this.renderList()
				}
			</ul>
		);
	}

}

Assets.propTypes = {
	assets: PropTypes.object.isRequired,
	setAsset: PropTypes.func.isRequired,
	setAssetActiveAccount: PropTypes.func.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
};

export default Assets;

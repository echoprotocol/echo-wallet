import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { formatAmount } from '../../helpers/FormatHelper';

class Tokens extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focusedId: null,
		};
	}

	onRemoveToken(name, id) {
		this.props.removeToken(name, id);
	}

	onFocus(id) {
		this.setState({ focusedId: id });
	}

	onBlur() {
		this.setState({ focusedId: null });
	}

	setAsset(symbol) {
		this.props.setGlobalValue('activeCoinTypeTab', 0);
		this.props.setAsset(symbol);
	}

	renderRow({
		id, symbol, precision, balance, disabled,
	}) {
		if (disabled || !precision) return null;

		return (
			<li
				className={classnames({ focused: id === this.state.focusedId })}
				key={id}
			>
				<button
					className="balance-item"
					key={id}
					onFocus={() => this.onFocus(id)}
					onBlur={() => this.onBlur()}
					onClick={() => this.setAsset({
						id, symbol, precision, balance,
					})}
				>
					<span className="currency-symbol">{symbol}</span>
					<span className="currency-amount">{formatAmount(balance, precision, '')}</span>
				</button>
				<button
					className="remove-token"
					onFocus={() => this.onFocus(id)}
					onBlur={() => this.onBlur()}
					onClick={(e) => this.onRemoveToken(symbol, id, e)}
					onKeyPress={(e) => this.onRemoveToken(symbol, id, e)}
				>
					<span className="icon-close" />
				</button>
			</li>
		);
	}

	renderList() {
		return (
			<React.Fragment>
				<h3 className="currency-title">Tokens</h3>
				<ul className="currency-list">
					{
						this.props.tokens.map((t) => this.renderRow(t))
					}
				</ul>
			</React.Fragment>
		);
	}

	render() {
		const { tokens } = this.props;

		if (!tokens || !tokens.size) {
			return null;
		}

		const activeContracts = tokens.toJS().filter((i) => !i.disabled);

		return activeContracts.length > 0 ? this.renderList() : null;
	}

}

Tokens.propTypes = {
	tokens: PropTypes.object.isRequired,
	removeToken: PropTypes.func.isRequired,
	setAsset: PropTypes.func.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
};

export default Tokens;

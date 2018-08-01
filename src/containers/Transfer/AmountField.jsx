import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Dropdown } from 'semantic-ui-react';

import formatAmount from '../../helpers/HistoryHelper';
import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setValue, setFormValue } from '../../actions/FormActions';

class AmountField extends React.Component {

	componentDidUpdate() {
		if (this.props.assets.length && !this.props.currency) {
			this.props.setValue('currency', this.props.assets[0]);
		}
	}

	onChangeAmount(e) {
		const { name: field, value } = e.target;

		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	setAvailableAmount(currency) {
		this.props.setFormValue('amount', this.getAvailableAmount(currency) / (10 ** currency.precision));
	}

	setCurrency(currency) {
		this.props.setValue('currency', currency);
	}

	getAvailableAmount(currency) {
		if (!currency) {
			return 0;
		}

		const { fee } = this.props;

		if (!fee) {
			return 0;
		}

		if (fee.asset && fee.asset.id !== currency.id) {
			return currency.balance;
		}

		return currency.balance - fee.value;
	}

	renderList(type) {
		const list = [
			<Dropdown.Header key={`${type}_header`} content={type.toUpperCase()} />,
		];

		return this.props[type].reduce((arr, a, i) => {
			const id = i;
			arr.push((
				<Dropdown.Item key={id} onClick={(e) => this.setCurrency(a, e)}>
					{a.symbol}
				</Dropdown.Item>
			));

			return arr;
		}, list);
	}

	render() {
		const { assets, tokens, amount } = this.props;

		const currency = this.props.currency || assets[0];

		return (
			<Form.Field>
				<label htmlFor="amount">
					Amount
					<ul className="list-amount">
						<li>
							Available Balance:
							<span role="button" onClick={(e) => this.setAvailableAmount(currency, e)} onKeyPress={(e) => this.setAvailableAmount(currency, e)} tabIndex="0">
								{ currency ? formatAmount(this.getAvailableAmount(currency), currency.precision, currency.symbol) : '0 ECHO' }
							</span>
						</li>
					</ul>
				</label>
				<Input type="text" placeholder="Amount" action>
					<div className="amount-wrap">
						<input className="amount" placeholder="Amount" value={amount.value} name="amount" onChange={(e) => this.onChangeAmount(e)} />
					</div>
					<Dropdown text={currency ? currency.symbol : ''} className="assets-tokens-dropdown">
						<Dropdown.Menu>
							{ assets.length ? this.renderList('assets') : null }
							{ tokens.length ? this.renderList('tokens') : null }
						</Dropdown.Menu>
					</Dropdown>
				</Input>
			</Form.Field>
		);
	}

}

AmountField.propTypes = {
	currency: PropTypes.object,
	fee: PropTypes.object,
	assets: PropTypes.any.isRequired,
	tokens: PropTypes.any.isRequired,
	amount: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

AmountField.defaultProps = {
	currency: null,
	fee: null,
};

export default connect(
	(state) => ({
		tokens: state.balance.get('tokens').toArray(),
		assets: state.balance.get('assets').toArray(),
		amount: state.form.getIn([FORM_TRANSFER, 'amount']),
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
	}),
)(AmountField);

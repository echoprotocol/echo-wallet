import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

import { formatAmount } from '../../helpers/FormatHelper';
import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setValue, setFormValue } from '../../actions/FormActions';

import FeeField from './FeeField';
import CurrencyField from './CurrencyField';

class AmountField extends React.Component {

	constructor() {
		super();
		this.state = {
			amountFocus: false,
		};
	}

	onChangeAmount(e) {
		const { currency } = this.props;

		let value = e.target.value.trim().match(/[0-9.]/g);
		value = value ? value.join('') : '';

		if (value !== '' && !Math.floor(value * (10 ** currency.precision))) {
			this.props.setValue(
				'amount',
				{
					error: `Amount should be more than ${1 / (10 ** currency.precision)}`,
					value,
				},
			);

			return;
		}

		this.props.setFormValue(e.target.name, value);
	}

	setAvailableAmount(currency) {
		this.props.setFormValue('amount', this.getAvailableAmount(currency) / (10 ** currency.precision));
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

	amountFocusToggle(e, value) {
		this.setState({
			amountFocus: !value,
		});
	}

	render() {
		const { assets, amount } = this.props;

		const currency = this.props.currency || assets[0];

		return (
			<Form.Field>
				<label htmlFor="amount">
					Amount
					<ul className="list-amount">
						<li>
							Fee:
							<FeeField />
						</li>
						<li>
							Available Balance:
							<span role="button" onClick={(e) => this.setAvailableAmount(currency, e)} onKeyPress={(e) => this.setAvailableAmount(currency, e)} tabIndex="0">
								{ currency ? formatAmount(currency.balance, currency.precision, currency.symbol) : '0 ECHO' }
							</span>
						</li>
					</ul>
				</label>
				<Input
					type="text"
					placeholder="Amount"
					tabIndex="0"
					action
					className={classnames('amount-wrap action-wrap', { error: amount.error }, { focused: this.state.amountFocus })}
				>
					<div className="amount-wrap action-wrap">
						<input
							className="amount"
							placeholder="Amount"
							value={amount.value}
							name="amount"
							onChange={(e) => this.onChangeAmount(e)}
							onFocus={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
							onBlur={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
						/>
						{ amount.error ? <span className="icon-error-red value-status" /> : null }
						<span className="error-message">{amount.error}</span>
					</div>
					<CurrencyField />
				</Input>
			</Form.Field>
		);
	}

}

AmountField.propTypes = {
	currency: PropTypes.object,
	fee: PropTypes.object,
	assets: PropTypes.any.isRequired,
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

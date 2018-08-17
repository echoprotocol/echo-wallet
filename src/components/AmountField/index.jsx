import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import { formatAmount } from '../../helpers/FormatHelper';

import { setValue, setFormValue } from '../../actions/FormActions';
import amountInput from '../../actions/AmountActions';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import FeeField from './FeeField';

class AmountField extends React.Component {

	constructor() {
		super();
		this.state = {
			searchText: '',
			amountFocus: false,
		};
	}

	componentDidUpdate() {
		if (this.props.assets.length && !this.props.currency) {
			this.props.setValue(this.props.form, 'currency', this.props.assets[0]);
		}
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}
	onChangeAmount(e) {
		const { currency } = this.props;

		const value = e.target.value.trim();
		const { name } = e.target;

		this.props.amountInput(this.props.form, value, currency, name);
	}

	onChangeCurrency(e, value) {
		const { tokens, assets } = this.props;
		let target = tokens.find((el) => el.id === value);
		if (target) {
			this.setCurrency(target, 'tokens');
			this.setState({ searchText: '' });

			return;
		}
		target = assets.find((el) => el.id === value);
		if (target) {
			this.setCurrency(target, 'assets');
			this.setState({ searchText: '' });

		}
	}

	onDropdownChange(e, value) {
		if (typeof e.target.value === 'undefined') { // if click
			this.onChangeCurrency(e, value);
		} else if (e.keyCode === 13) { // if enter
			this.onChangeCurrency(e, value);
		}


	}

	setAvailableAmount(currency) {
		this.props.setFormValue(this.props.form, 'amount', this.getAvailableAmount(currency) / (10 ** currency.precision));
	}

	setCurrency(currency, type) {
		this.props.setValue(this.props.form, 'currency', { ...currency, type });
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


	renderList(type) {
		const { searchText } = this.state;
		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;
		const list = (search || this.props[type].length === 0) ? [] : [
			{
				key: `${type}_header`,
				text: type.toUpperCase(),
				value: type.toUpperCase(),
				className: 'header',
				disabled: true,
			},
		];
		return this.props[type].reduce((arr, a, i) => {
			if (!search || a.symbol.toLowerCase().match(search)) {
				const id = i;
				arr.push({
					key: a ? a.id : id,
					text: a ? a.symbol : '',
					value: a ? a.id : id,
				});
			}

			return arr;

		}, list);
	}

	render() {
		const {
			assets, amount, form,
		} = this.props;
		const { searchText } = this.state;
		const currency = this.props.currency || assets[0];
		const options = this.renderList('assets').concat(this.renderList('tokens'));
		return (
			<Form.Field>
				<label htmlFor="amount">
					Amount
					<ul className="list-amount">
						<li>
							Fee:
							<FeeField form={form} />
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
					</div>
					{amount.error && <span className="error-message">{amount.error}</span>}
					{/* if elements =< 1 add class no-choice */}
					<Dropdown
						search
						onChange={(e, { value }) => this.onDropdownChange(e, value)}
						searchQuery={searchText}
						closeOnChange
						onSearchChange={(e) => this.onSearch(e)}
						text={currency ? currency.symbol : ''}
						selection
						options={options}
						className={classnames('assets-tokens-dropdown', { 'no-choice': (this.props.tokens.length + this.props.assets.length) <= 1 })}
					/>

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
	amountInput: PropTypes.func.isRequired,
	form: PropTypes.string.isRequired,
};

AmountField.defaultProps = {
	currency: null,
	fee: null,
};

export default connect(
	(state, ownProps) => {
		const { form } = ownProps;
		return {
			assets: state.balance.get('assets').toArray(),
			amount: state.form.getIn([form, 'amount']),
			currency: state.form.getIn([form, 'currency']),
			fee: state.form.getIn([form, 'fee']),
			tokens: form === FORM_TRANSFER ? state.balance.get('tokens').toArray() : [],

		};
	},
	(dispatch) => ({
		setValue: (form, field, value) => dispatch(setValue(form, field, value)),
		setFormValue: (form, field, value) => dispatch(setFormValue(form, field, value)),
		amountInput: (form, value, currency, name) =>
			dispatch(amountInput(form, value, currency, name)),
	}),
)(AmountField);

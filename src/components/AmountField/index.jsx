import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import { formatAmount } from '../../helpers/FormatHelper';

import { setValue, setFormValue, setFormError } from '../../actions/FormActions';
import { amountInput } from '../../actions/AmountActions';
import { setContractFees } from '../../actions/ContractActions';

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
			this.props.setValue('currency', this.props.assets[0]);
		}
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}

	onChangeAmount(e) {
		const { currency } = this.props;
		const value = e.target.value.trim();
		const { name } = e.target;

		this.props.amountInput(value, currency, name);
		if (currency && currency.type === 'tokens') this.props.setContractFees();
	}

	onChangeCurrency(e, value) {
		const { tokens, assets } = this.props;
		let target = tokens.find((el) => el.id === value);
		if (target) {
			this.setCurrency(target, 'tokens');
			this.props.setContractFees();
			return;
		}
		target = assets.find((el) => el.id === value);
		if (target) {
			this.setCurrency(target, 'assets');
		}
	}

	onDropdownChange(e, value) {
		if (typeof e.target.value === 'undefined') {
			this.onChangeCurrency(e, value);
		} else if (e.keyCode === 13) {
			this.onChangeCurrency(e, value);
			setTimeout(() => { e.target.blur(); }, 0);
		}
	}

	setAvailableAmount(currency) {
		this.props.setFormValue('amount', this.getAvailableAmount(currency) / (10 ** currency.precision));
	}

	setCurrency(currency, type) {
		this.props.setFormError('amount', null);
		this.props.setFormError('tokens', null);
		this.props.setValue('currency', { ...currency, type });
		this.setState({ searchText: '' });
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

	clearSearchText() {
		this.setState({ searchText: '' });
	}

	amountFocusToggle(e, focus) {
		this.setState({
			amountFocus: !focus,
		});

		const { currency } = this.props;
		const value = e.target.value.trim();
		const { name } = e.target;

		this.props.amountInput(value, currency, name);
	}


	renderList(type) {
		const { searchText } = this.state;
		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;

		const list = (
			searchText !== ''
			|| search
			|| !this.props[type].length
			|| this.props[type].filter((i) => i.disabled).length === this.props[type].length
		) ? [] : [
				{
					key: `${type}_header`,
					text: '',
					value: type.toUpperCase(),
					className: `${type}_header header`,
					disabled: true,
				},
			];
		return this.props[type].reduce((arr, a, i) => {
			if ((!search || a.symbol.toLowerCase().match(search)) && !a.disabled) {
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
			assets, amount, form, fee,
		} = this.props;
		const { searchText } = this.state;
		const currency = this.props.currency || assets[0];
		const type = form === FORM_TRANSFER && currency && currency.type !== 'tokens' ? 'transfer' : 'call_contract';

		return (
			<Form.Field>
				<label htmlFor="amount">
					Amount
					<ul className="list-amount">
						<li>
							Fee:
							<FeeField form={form} type={type} />
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
					className={classnames('amount-wrap action-wrap', { error: amount.error || fee.error }, { focused: this.state.amountFocus })}
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
						{ amount.error || fee.error ? <span className="icon-error-red value-status" /> : null }
					</div>
					{ amount.error || fee.error ? <span className="error-message">{amount.error || fee.error}</span> : null }
					<Dropdown
						search
						onChange={(e, { value }) => this.onDropdownChange(e, value)}
						searchQuery={searchText}
						closeOnChange
						onSearchChange={(e) => this.onSearch(e)}
						text={currency ? currency.symbol : ''}
						selection
						onBlur={() => this.clearSearchText()}
						options={this.renderList('assets').concat(this.renderList('tokens'))}
						noResultsMessage="No results are found"
						className={classnames('assets-tokens-dropdown', { 'no-choice': (this.props.tokens.length + this.props.assets.length) <= 1 })}
						onClose={() => this.clearSearchText()}
					/>

				</Input>

			</Form.Field>
		);
	}

}

AmountField.propTypes = {
	form: PropTypes.string.isRequired,

	currency: PropTypes.object,
	fee: PropTypes.object,
	assets: PropTypes.any.isRequired,
	tokens: PropTypes.any.isRequired,
	amount: PropTypes.object.isRequired,

	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,

	setContractFees: PropTypes.func.isRequired,
};

AmountField.defaultProps = {
	currency: null,
	fee: null,
};

export default connect(
	(state, { form }) => ({
		assets: state.balance.get('assets').toArray(),
		amount: state.form.getIn([form, 'amount']),
		currency: state.form.getIn([form, 'currency']),
		fee: state.form.getIn([form, 'fee']),
		tokens: form === FORM_TRANSFER ? state.balance.get('tokens').toArray() : [],
	}),
	(dispatch, { form }) => ({
		setValue: (field, value) => dispatch(setValue(form, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(form, field, value)),
		amountInput: (value, currency, name) => dispatch(amountInput(form, value, currency, name)),
		setFormError: (field, error) => dispatch(setFormError(form, field, error)),
		setContractFees: () => dispatch(setContractFees(form)),
	}),
)(AmountField);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import BN from 'bignumber.js';

import classnames from 'classnames';

import { formatAmount } from '../../helpers/FormatHelper';

import { setValue, setFormValue, setFormError } from '../../actions/FormActions';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setContractFees } from '../../actions/ContractActions';
import { fetchFee } from '../../actions/TransactionActions';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import FeeField from './FeeField';
import { PREFIX_ASSET } from '../../constants/GlobalConstants';

class AmountField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			amountFocus: false,
			timeout: null,
		};
	}

	componentDidMount() {
		this.props.setDefaultAsset();
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}

	onChangeAmount(e) {
		const { currency } = this.props;
		const value = e.target.value.trim();
		const { name } = e.target;
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.props.amountInput(value, currency, name);
		if (currency && currency.type === 'tokens') this.props.setContractFees();


		this.setState({
			timeout: setTimeout(() => {
				if (value) return;
				const typeOperation = currency.id.startsWith(PREFIX_ASSET) ? 'transfer' : 'call_contract';
				this.props.fetchFee(typeOperation);
			}, 300),
		});


	}

	onChangeCurrency(e, value) {
		const {
			amount,
			tokens,
			assets,
			form,
			assetsFromTransfer,
			isWalletAccount,
		} = this.props;

		const targetAsset = !isWalletAccount && form === FORM_TRANSFER ? assetsFromTransfer : assets;

		let target = null;

		if (isWalletAccount && form === FORM_TRANSFER) {
			target = tokens.find((el) => el.id === value);

			if (target) {
				this.setCurrency(target, 'tokens');
				if (amount.value) {
					this.props.fetchFee('call_contract');
					this.props.setContractFees();
				}
				return;
			}
		}

		target = targetAsset.find((el) => el.id === value);
		if (!target) return;
		this.setCurrency(target, 'assets');
		if (!amount.value) return;
		this.props.fetchFee('transfer');
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

		const amount = new BN(currency.balance).minus(fee.value);

		return amount.isNegative() ? 0 : amount;
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
		const { form, isWalletAccount } = this.props;

		const target = type === 'assets' && !isWalletAccount && form === FORM_TRANSFER ? 'assetsFromTransfer' : type;
		const search = searchText ? new RegExp(searchText.toLowerCase(), 'gi') : null;

		const list = (
			searchText !== ''
			|| search
			|| !this.props[target].length
			|| this.props[target].filter((i) => i.disabled).length === this.props[type].length
		) ? [] : [
				{
					key: `${type}_header`,
					text: '',
					value: type.toUpperCase(),
					className: `${type}_header header`,
					disabled: true,
				},
			];
		return this.props[target].reduce((arr, a, i) => {
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
			assets,
			amount,
			form,
			fee,
			assetsFromTransfer,
			isWalletAccount,
		} = this.props;

		const targetAsset = !isWalletAccount && form === FORM_TRANSFER ? assetsFromTransfer : assets;

		const { searchText } = this.state;
		const currency = this.props.currency || targetAsset[0];
		const type = form === FORM_TRANSFER && currency && currency.type === 'tokens' ? 'call_contract' : 'transfer';

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
							<span
								role="button"
								onClick={(e) => this.setAvailableAmount(currency, e)}
								onKeyPress={(e) => this.setAvailableAmount(currency, e)}
								tabIndex="0"
							>
								{currency ? formatAmount(currency.balance, currency.precision, currency.symbol) : '0 ECHO'}
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
						{amount.error || fee.error ? <span className="icon-error-red value-status" /> : null}
					</div>
					{amount.error || fee.error ? <span className="error-message">{amount.error || fee.error}</span> : null}
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
						className={classnames('assets-tokens-dropdown', { 'no-choice': (this.props.tokens.length + targetAsset.length) <= 1 })}
						onClose={() => this.clearSearchText()}
					/>

				</Input>

			</Form.Field>
		);
	}

}

AmountField.propTypes = {
	form: PropTypes.string.isRequired,
	isWalletAccount: PropTypes.bool.isRequired,

	currency: PropTypes.object,
	fee: PropTypes.object,
	assets: PropTypes.array,
	assetsFromTransfer: PropTypes.array,
	tokens: PropTypes.any.isRequired,

	amount: PropTypes.object.isRequired,

	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	fetchFee: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

AmountField.defaultProps = {
	currency: null,
	fee: null,
	assets: [],
	assetsFromTransfer: [],
};

export default connect(
	(state, { form }) => {
		const isWalletAccount = state.form.getIn([FORM_TRANSFER, 'isWalletAccount']);
		return {
			assetsFromTransfer: state.form.getIn([FORM_TRANSFER, 'balance']).assets.toArray(),
			isWalletAccount,
			assets: state.balance.get('assets').toArray(),
			amount: state.form.getIn([form, 'amount']),
			currency: state.form.getIn([form, 'currency']),
			fee: state.form.getIn([form, 'fee']),
			tokens: form === FORM_TRANSFER && isWalletAccount ? state.balance.get('tokens').toArray() : [],
		};
	},
	(dispatch, { form }) => ({
		setValue: (field, value) => dispatch(setValue(form, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(form, field, value)),
		amountInput: (value, currency, name) => dispatch(amountInput(form, value, currency, name)),
		setFormError: (field, error) => dispatch(setFormError(form, field, error)),
		setContractFees: () => dispatch(setContractFees(form)),
		setDefaultAsset: () => dispatch(setDefaultAsset(form)),
		fetchFee: (type) => dispatch(fetchFee(form, type)),
	}),
)(AmountField);

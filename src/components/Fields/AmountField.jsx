/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Dropdown, Popup } from 'semantic-ui-react';
import BN from 'bignumber.js';
import classnames from 'classnames';

import { FORM_TRANSFER, FORM_FREEZE } from '../../constants/FormConstants';
import { PREFIX_ASSET, ADDRESS_PREFIX } from '../../constants/GlobalConstants';

import { formatAmount } from '../../helpers/FormatHelper';

import FeeField from './FeeField';

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

	componentDidUpdate(prevProps) {
		if (!prevProps.currency && prevProps.currency !== this.props.currency) {
			this.props.setDefaultAsset();
		}
	}

	onSearch(e) {
		this.setState({ searchText: e.target.value });
	}

	onChangeAmount(e) {
		const { currency, form } = this.props;
		const value = e.target.value.trim();
		const { name } = e.target;
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.props.amountInput(value, currency, name);

		if ((currency && currency.type === 'tokens') || form !== FORM_TRANSFER) this.props.setContractFees();

		this.setState({
			timeout: setTimeout(() => {
				if ([FORM_FREEZE, FORM_TRANSFER].includes(form) && currency.id.startsWith(PREFIX_ASSET)) {
					this.props.getTransferFee()
						.then((fee) => fee && this.onFee(fee));
				}
			}, 300),
		});
	}

	onChangeCurrency(e, value) {
		const { tokens, assets, form } = this.props;

		let target = null;

		if (form === FORM_TRANSFER) {
			target = tokens.find((el) => el.id === value);

			if (target) {
				this.setCurrency(target, 'tokens');
				this.props.setContractFees();
				return;
			}
		}

		target = assets.find((el) => el.id === value);
		if (!target) return;
		this.setCurrency(target, 'assets');
		this.props.getTransferFee()
			.then((fee) => fee && this.onFee(fee));
	}

	onDropdownChange(e, value) {
		if (typeof e.target.value === 'undefined') {
			this.onChangeCurrency(e, value);
		} else if (e.keyCode === 13) {
			this.onChangeCurrency(e, value);
			setTimeout(() => { e.target.blur(); }, 0);
		}
	}

	onFee(fee) {
		if (!fee) {
			this.props.setFormValue('fee', fee);
		} else {
			this.props.setValue('fee', fee);
		}
	}

	setAvailableAmount(currency) {
		const { isAvailableBalance, fee } = this.props;
		if (!isAvailableBalance || !fee.value) return;
		const value = this.getAvailableAmount(currency) / (10 ** currency.precision);
		this.props.setFormValue('amount', value);
		this.onChangeAmount({ target: { value: value.toString() }, name: 'amount' });
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

		const amount = new BN(currency.balance).minus(fee.value || 0);

		return amount.isNegative() ? 0 : amount;
	}

	getAvailableBalance(currency) {
		if (currency) {
			return (
				currency.symbol === ADDRESS_PREFIX ?
					formatAmount(currency.balance, currency.precision, currency.symbol) :
					<React.Fragment>
						{formatAmount(currency.balance, currency.precision)}
						<Popup
							trigger={<span className="inner-tooltip-trigger icon-coin" />}
							content={currency.symbol}
							className="asset-tooltip"
							inverted
						/>
					</React.Fragment>
			);
		}
		return '0 ECHO';
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
			assets, amount, form, fee, isAvailableBalance, fees, assetDropdown, labelText,
		} = this.props;

		const { searchText } = this.state;
		const currency = this.props.currency || assets[0];
		const type = [FORM_TRANSFER, FORM_FREEZE]
			.includes(form) && currency && !currency.id.startsWith(PREFIX_ASSET) ? 'contract_call' : 'transfer';

		return (
			<Form.Field>
				<label htmlFor="amount">
					{labelText}
					<ul className="list-amount">
						{fee && fee.value &&
							<li>
								{fee && fee.value && 'Fee:'}
								<FeeField
									currency={currency}
									fees={fees}
									form={form}
									type={type}
									fee={fee}
									assets={assets.toJS()}
									setValue={this.props.setValue}
									setFormValue={this.props.setFormValue}
									getTransferFee={this.props.getTransferFee}
								/>
							</li>
						}
						<li>
							Available:
							<span
								className={classnames({ disabled: !isAvailableBalance || !fee.value })}
								role="button"
								onClick={(e) => this.setAvailableAmount(currency, e)}
								onKeyPress={(e) => this.setAvailableAmount(currency, e)}
								tabIndex="0"
							>
								{
									this.getAvailableBalance(currency)
								}
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
					<div className={classnames('amount-wrap', 'action-wrap', { 'without-dropdown': !assetDropdown })} >
						<input
							className="amount"
							placeholder="0.00"
							value={amount.value}
							name="amount"
							onChange={(e) => this.onChangeAmount(e)}
							onFocus={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
							onBlur={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
						/>
						{amount.error || fee.error ? <span className="icon-error-red value-status" /> : null}
					</div>
					{amount.error || fee.error ? <span className="error-message">{amount.error || fee.error}</span> : null}
					{
						assetDropdown && <Dropdown
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
							className={classnames('assets-tokens-dropdown', { 'no-choice': (this.props.tokens.length + assets.length) <= 1 })}
							onClose={() => this.clearSearchText()}
						/>
					}


				</Input>

			</Form.Field>
		);
	}

}

AmountField.propTypes = {
	fees: PropTypes.array.isRequired,
	form: PropTypes.string.isRequired,
	fee: PropTypes.object,
	assets: PropTypes.object,
	tokens: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	assetDropdown: PropTypes.bool,
	labelText: PropTypes.string,
};


AmountField.defaultProps = {
	currency: null,
	fee: {},
	assets: null,
	assetDropdown: true,
	labelText: 'Amount',
};

export default AmountField;

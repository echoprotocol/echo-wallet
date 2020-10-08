/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Dropdown, Popup } from 'semantic-ui-react';
import BN from 'bignumber.js';
import classnames from 'classnames';
import { List } from 'immutable';

import { FORM_TRANSFER, FORM_FREEZE } from '../../constants/FormConstants';
import { PREFIX_ASSET, ADDRESS_PREFIX } from '../../constants/GlobalConstants';
import { SIDECHAIN_DISPLAY_NAMES } from '../../constants/SidechainConstants';

import { formatAmount } from '../../helpers/FormatHelper';
import FeeField from './FeeField';
import ErrorMessage from '../ErrorMessage';
import Services from '../../services';

class AmountFieldWithAssets extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			amountFocus: false,
			timeout: null,
			options: this.renderList('assets').concat(this.renderList('tokens')),
		};
	}

	componentDidMount() {
		this.props.setDefaultAsset();
		if (!this.props.receive) {
			this.props.getTransferFee()
				.then((fee) => fee && this.onFee(fee));
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.currency && prevProps.currency !== this.props.currency) {
			this.props.setDefaultAsset();
			if (!this.props.receive) {
				this.props.getTransferFee()
					.then((fee) => fee && this.onFee(fee));
			}
		}
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_TRANSFER);
	}

	onSearch(e, data) {
		const searchText = data.searchQuery;
		this.setState({
			searchText,
		});
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		(async () => {
			const assets = await Services.getEcho().api.listAssets(searchText);
			const options = searchText ? assets.map(({ symbol, id, precision }) => ({
				key: id,
				text: symbol,
				value: id,
				precision,
			})) : [];
			this.setState({
				options: this.renderList('tokens').concat(options),
			});
		})();
	}

	onChangeAmount(e) {
		const { currency, form, receive } = this.props;
		const value = e.target.value.trim();
		const { name } = e.target;
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.props.amountInput(value, currency, name);

		if (receive) {
			return;
		}

		if ((currency && currency.type === 'tokens') || form !== FORM_TRANSFER) this.props.setContractFees();

		this.setState({
			timeout: setTimeout(() => {
				if ([FORM_FREEZE, FORM_TRANSFER].includes(form) && currency
					&& currency.id.startsWith(PREFIX_ASSET)) {
					this.props.getTransferFee()
						.then((fee) => fee && this.onFee(fee));
				}
			}, 300),
		});
	}

	onChangeCurrency(e, currency) {
		const { form } = this.props;
		this.props.setFormError('amount', null);
		this.props.setFormError('tokens', null);
		const { value, text, precision } = this.state.options.find((el) => el.value === currency);
		const balance = this.getBalance(e, currency);

		if (form === FORM_TRANSFER) {
			const type = text === 'ECHO' ? undefined : 'tokens';
			this.props.setValue('currency', {
				id: value, symbol: text, balance, precision, type,
			});
		} else {
			this.props.setValue('currency', {
				id: value, symbol: text, balance, precision, type: 'assets',
			});
		}
		this.clearSearchText();
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

	getBalance(e, value) {
		const { tokens, assets, form } = this.props;
		let target = null;

		if (form === FORM_TRANSFER) {
			target = tokens.find((el) => el.id === value);
		}
		target = assets.find((el) => el.id === value);

		if (!target) {
			return '0';
		}

		return target.balance;
	}

	setAvailableAmount(currency) {
		const { isAvailableBalance, fee } = this.props;
		if (!isAvailableBalance || !fee.value) return;
		const value = this.getAvailableAmount(currency) / (10 ** currency.precision);
		this.props.setFormValue('amount', value);
		this.onChangeAmount({ target: { value: value.toString() }, name: 'amount' });
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

	getAvailableBalance(currency = {}) {
		const { precision, balance, symbol } = currency;
		if (!currency || !precision || !balance || !symbol) {
			return '0';
		}

		return (
			currency.symbol === ADDRESS_PREFIX ?
				formatAmount(balance, precision, symbol) :
				<React.Fragment>
					{formatAmount(balance, precision)}
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-coin" />}
						content={currency.symbol}
						className="asset-tooltip"
						inverted
					/>
				</React.Fragment>
		);
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
		const { searchText } = this.state || '';
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
					precision: a ? a.precision : null,
				});
			}
			return arr;
		}, list);
	}

	renderErrorStatus(assetDropdown, amountError, feeError) {
		if (!assetDropdown) {
			return null;
		}
		return (amountError || feeError) &&
			<span className="icon-error value-status" />;
	}

	renderCurrencyLabel(currency) {
		if (currency) {
			return <div className="currency-label">{currency.symbol}</div>;
		}
		return null;
	}
	render() {
		const {
			assets, amount, form,
			fee, isAvailableBalance,
			fees, assetDropdown,
			showAvailable,
			isDisplaySidechainNotification,
			autoFocus, intl,
			activeCoinTypeTab,
		} = this.props;

		const { searchText, options } = this.state;
		const currency = this.props.currency || assets[0];
		const type = [FORM_TRANSFER, FORM_FREEZE]
			.includes(form) && currency && currency.id && !currency.id.startsWith(PREFIX_ASSET) ? 'contract_call' : 'transfer';
		const text = searchText || currency ? currency.symbol : '';
		return (
			<Form.Field>
				<label htmlFor="amount">
					{intl.formatMessage && intl.formatMessage({ id: 'amount_input.title' })}
					<ul className="list-amount">
						{fee && fee.value && amount.value &&
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
						{
							showAvailable && (
								<li>
									{intl.formatMessage ? intl.formatMessage({ id: 'amount_input.available' }) : 'Available: '}
									<span
										className={classnames({ disabled: !isAvailableBalance || !fee.value })}
										role="button"
										onClick={(e) => this.setAvailableAmount(currency, e)}
										onKeyPress={(e) => this.setAvailableAmount(currency, e)}
										tabIndex={!isAvailableBalance || !fee.value ? '-1' : '0'}
									>
										{
											this.getAvailableBalance(currency)
										}
									</span>
								</li>
							)
						}
					</ul>
				</label>
				<Input
					type="text"
					placeholder={intl.formatMessage ? intl.formatMessage({ id: 'amount_input.placeholder' }) : 'Amount'}
					tabIndex="0"
					action
					className={classnames('amount-wrap action-wrap', { error: amount.error || fee.error }, { focused: this.state.amountFocus })}
				>
					<div
						className={classnames(
							'amount-wrap',
							'action-wrap',
							{ 'without-dropdown': !assetDropdown },
						)}
					>
						<input
							className="amount"
							placeholder="0.00"
							value={amount.value}
							name="amount"
							autoComplete="off"
							onChange={(e) => this.onChangeAmount(e)}
							onFocus={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
							onBlur={(e) => this.amountFocusToggle(e, this.state.amountFocus)}
							autoFocus={autoFocus}
						/>
						{
							this.renderErrorStatus(assetDropdown, amount.error, fee.error)
						}
					</div>

					<ErrorMessage
						value={amount.error || fee.error}
						intl={intl}
					/>

					{
						assetDropdown ? <Dropdown
							search
							disabled={(this.props.tokens.size + assets.size) <= 1}
							onChange={(e, { value }) => this.onDropdownChange(e, value)}
							searchQuery={searchText}
							closeOnChange
							icon={(this.props.tokens.size + assets.size) <= 1 ? null : 'dropdown'}
							onSearchChange={(e, data) => this.onSearch(e, data)}
							text={text}
							selection={!(this.props.tokens.size + assets.size) <= 1}
							onBlur={() => this.clearSearchText()}
							options={options}
							noResultsMessage={
								intl.formatMessage ?
									intl.formatMessage({ id: 'amount_input.no_result_message' }) :
									'No results are found'
							}
							className="assets-tokens-dropdown"
							onClose={() => this.clearSearchText()}
						/> : this.renderCurrencyLabel(currency)
					}
				</Input>
				{
					intl.formatMessage && isDisplaySidechainNotification
					&& activeCoinTypeTab && (!amount.error || !fee.error) ?
						<span className="warning-message">
							{intl.formatMessage({ id: 'amount_input.warning_message_pt1' })}
							{SIDECHAIN_DISPLAY_NAMES[activeCoinTypeTab].echo}&nbsp;
							{intl.formatMessage({ id: 'amount_input.warning_message_pt2' })}
							<span className="special">
								{intl.formatMessage({ id: 'amount_input.warning_message_pt3' })}
							</span>
							{intl.formatMessage({ id: 'amount_input.warning_message_pt4' })}
							{SIDECHAIN_DISPLAY_NAMES[activeCoinTypeTab].original}
							{intl.formatMessage({ id: 'amount_input.warning_message_pt5' })}
						</span>
						: null
				}


			</Form.Field>
		);
	}

}

AmountFieldWithAssets.propTypes = {
	fees: PropTypes.array.isRequired,
	form: PropTypes.string.isRequired,
	fee: PropTypes.object,
	assets: PropTypes.object,
	tokens: PropTypes.object,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	intl: PropTypes.any,
	setContractFees: PropTypes.func,
	getTransferFee: PropTypes.func,
	assetDropdown: PropTypes.bool,
	receive: PropTypes.bool,
	showAvailable: PropTypes.bool,
	isDisplaySidechainNotification: PropTypes.bool,
	autoFocus: PropTypes.bool,
	activeCoinTypeTab: PropTypes.any,
	clearForm: PropTypes.func.isRequired,
};


AmountFieldWithAssets.defaultProps = {
	currency: null,
	fee: {},
	intl: {},
	assets: null,
	tokens: new List([]),
	assetDropdown: true,
	receive: false,
	setContractFees: () => Promise.resolve(),
	getTransferFee: () => Promise.resolve(),
	showAvailable: true,
	isDisplaySidechainNotification: false,
	autoFocus: false,
	activeCoinTypeTab: 0,
};

export default AmountFieldWithAssets;

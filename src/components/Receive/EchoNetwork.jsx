import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { List } from 'immutable';
import { validators } from 'echojs-lib';
import BN from 'bignumber.js';
import { FormattedMessage, injectIntl } from 'react-intl';

import { BRIDGE_RECEIVE_URL } from '../../constants/GlobalConstants';
import { FORM_TRANSFER } from '../../constants/FormConstants';
import { MODAL_GENERATE_ECHO_ADDRESS } from '../../constants/ModalConstants';

import Avatar from '../Avatar';
import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';
import ModalCreateEchoAddress from '../Modals/ModalCreateEchoAddress';
import DropdownActionBtn from '../DropdownActionBtn';


class EchoNetwork extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addresses: new List([]),
			receiver: '',
			searchText: '',
			open: false,
			timeout: null,
			searchAddr: [],
			searchAccs: [],
		};
	}


	componentDidMount() {
		this.props.updateAccountAddresses();
	}

	componentDidUpdate(prevProps) {
		if (this.props.accountAddresses !== prevProps.accountAddresses ||
			this.props.accountName !== prevProps.accountName) {
			this.onChange(null, this.state.searchText);
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const isUpdate = nextProps.accountAddresses.find((value) => !prevState.addresses.find((v) => v.get('address') === value.get('address')));

		if (!isUpdate) {
			return {};
		}

		return { addresses: nextProps.accountAddresses };
	}

	onClickItem(value) {
		this.setState({
			searchText: '',
			receiver: value,
			open: !this.state.open,
		});
	}

	onChange(e, value) {
		this.setState({ searchText: value });
		const addresses = this.props.accountAddresses.toJS();
		const users = this.props.accountName;
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.setState({
			timeout: setTimeout(() => {
				const filteredAddresses = addresses.filter(({ address }) => address.match(value));
				const filteredAccs = [users].filter((user) => user.match(value));
				this.setState({
					searchAddr: filteredAddresses,
					searchAccs: filteredAccs,
				});
			}, 300),
		});
	}

	getReceiver() {
		const { accountName } = this.props;
		const { addresses, receiver } = this.state;

		if (accountName === receiver) {
			return accountName;
		}

		const address = addresses.find((a) => a.get('address') === receiver);

		return address ? address.get('address') : null;
	}

	getQrData() {
		const receiverValue = this.getReceiver();

		if (!receiverValue) {
			return '';
		}

		const link = `${BRIDGE_RECEIVE_URL}${receiverValue}/${this.formatCurrencyId()}/${this.formatAmount()}/widget`;

		return link;
	}

	formatCurrencyId() {
		const { currency } = this.props;
		if (!currency || !currency.id) {
			return null;
		}
		const name = validators.isAssetId(currency.id) ? 'asset' : 'token';
		const id = currency.id.split('.')[2];

		return `${name}-${id}`;
	}

	formatAmount() {
		const { amount, currency } = this.props;
		if (!currency || !currency.precision || !amount || !amount.value) {
			return null;
		}

		return new BN(amount.value).toString(10);
	}


	renderAccountHeader() {
		const acconutHeaderTitle = (
			<div className="title">
				<FormattedMessage id="wallet_page.receive_payment.echo.generate_address_dropdown.acc_separator" />
			</div>
		);

		const header = [{
			className: 'dropdown-header',
			value: 'accounts-header',
			key: 'accounts-header',
			content: acconutHeaderTitle,
			disabled: true,
		}];
		return header;
	}
	renderAccountsList() {

		const users = this.state.searchAccs;

		const options = users.map((name) => {
			const content = (
				<React.Fragment>
					<div className="avatar-wrap">
						<Avatar accountName={name} />
					</div>
					<div className="name">{name}</div>
				</React.Fragment>
			);

			return ({
				className: 'user-item',
				value: name,
				key: name,
				text: name,
				content,
				onClick: () => this.onClickItem(name),
			});
		});

		return options;
	}


	renderAddressesHeader() {
		const addressHeaderTitle = (
			<div className="title">
				<FormattedMessage id="wallet_page.receive_payment.echo.generate_address_dropdown.adr_separator" />
			</div>
		);

		const header = [{
			className: 'dropdown-header',
			value: 'address-header',
			key: 'address-header',
			content: addressHeaderTitle,
			onClick: (e) => e.stopPropagation(),
			disabled: true,
		}];
		return header;
	}
	renderAddressesList() {
		const addresses = this.state.searchAddr;


		const users = addresses.map((a) => ({
			name: a.label,
			address: a.address,
		}));


		const options = users.map(({
			name, address,
		}, index) => {
			const content = (
				<React.Fragment key={name} >
					<div className="address-item">
						<div className="address">{address}</div>
						<DropdownActionBtn
							icon="icon-icopy-tiny"
							show={this.state.open}
							size="mini"
							copy={address}
							action={(e) => e.stopPropagation()}
						/>
					</div>
					<div className="name">{name}</div>
				</React.Fragment>
			);

			return ({
				className: 'address-item-wrap',
				value: name,
				key: index.toString(),
				text: address,
				content,
				onClick: () => this.onClickItem(address),
			});
		});

		return options.length && options;
	}
	renderGenerateAddressButton() {
		const { intl } = this.props;
		const btnValue = intl.formatMessage({ id: 'wallet_page.receive_payment.echo.generate_address_dropdown.button_text' });
		const generateAddressItem = [{
			className: 'generate-address',
			value: 'generate-address',
			key: 'generate-address',
			content: btnValue,
			onClick: () => {
				this.setState({ open: false });
				this.props.openModal(MODAL_GENERATE_ECHO_ADDRESS);
			},
			selected: false,
		}];
		return generateAddressItem;
	}

	renderOptions() {
		const { searchAddr, searchAccs } = this.state;
		const renderAccSection = searchAccs.length;
		const renderAdrSection = searchAddr.length;
		const AccSection = renderAccSection ?
			this.renderAccountHeader().concat(this.renderAccountsList(searchAccs)) : [];
		const AdrSection = renderAdrSection ?
			this.renderAddressesHeader().concat(this.renderAddressesList(searchAddr)) : [];
		return [].concat(AccSection).concat(AdrSection).concat(this.renderGenerateAddressButton())
			.filter((el) => el !== null);
	}
	render() {

		const {
			currency, fee, assets, tokens, amount, isAvailableBalance, fees, intl,
		} = this.props;

		const amountTexts = {
			label: intl.formatMessage({ id: 'amount_input.title' }),
			placeholder: intl.formatMessage({ id: 'amount_input.placeholder' }),
			available: intl.formatMessage({ id: 'amount_input.available' }),
			noRes: intl.formatMessage({ id: 'amount_input.no_result_message' }),
			warningMsgPt1: intl.formatMessage({ id: 'amount_input.warning_message_pt1' }),
			warningMsgPt2: intl.formatMessage({ id: 'amount_input.warning_message_pt2' }),
			warningMsgPt3: intl.formatMessage({ id: 'amount_input.warning_message_pt3' }),
		};

		const { receiver, open, searchText } = this.state;
		const receiverValue = this.getReceiver();
		const dropdownPlaceholder =
			intl.formatMessage({ id: 'wallet_page.receive_payment.echo.generate_address_dropdown.placeholder' });

		const link = this.getQrData();

		return (
			<div className="payment-wrap">
				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.echo.description_part1" />
				</p>
				<ModalCreateEchoAddress />

				<p className="payment-description">
					<FormattedMessage id="wallet_page.receive_payment.echo.description_part2" />
				</p>
				<div className="dropdown-wrap">
					<div className="dropdown-label">
						<FormattedMessage id="wallet_page.receive_payment.echo.generate_address_dropdown.title" />
					</div>
					<Dropdown
						placeholder={dropdownPlaceholder}
						options={this.renderOptions()}
						search={() => this.renderOptions()}
						text={receiver || 'Choose account or address'}
						searchQuery={searchText}
						onSearchChange={(e, { searchQuery }) => this.onChange(e, searchQuery)}
						onClick={() => { if (!open) { this.setState({ open: true }); } }}
						onBlur={() => this.setState({ open: false })}
						open={open}
					/>
				</div>

				<AmountField
					fees={fees}
					form={FORM_TRANSFER}
					fee={fee}
					assets={assets}
					tokens={tokens}
					amount={amount}
					currency={currency}
					isAvailableBalance={isAvailableBalance}
					amountInput={this.props.amountInput}
					setFormError={this.props.setFormError}
					setFormValue={this.props.setFormValue}
					setValue={this.props.setValue}
					setDefaultAsset={this.props.setDefaultAsset}
					getTransferFee={this.props.getTransferFee}
					setContractFees={this.props.setContractFees}
					assetDropdown
					receive
					texts={amountTexts}
				/>
				{
					receiverValue ? <QrCode link={link} /> : null
				}
			</div>
		);
	}

}

EchoNetwork.propTypes = {
	fees: PropTypes.array.isRequired,
	currency: PropTypes.object,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.any.isRequired,
	amount: PropTypes.object.isRequired,
	fee: PropTypes.object.isRequired,
	// eslint-disable-next-line react/no-unused-prop-types
	accountAddresses: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	updateAccountAddresses: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

EchoNetwork.defaultProps = {
	currency: null,
};


export default injectIntl(EchoNetwork);

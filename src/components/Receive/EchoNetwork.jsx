import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { List } from 'immutable';
import { validators } from 'echojs-lib';
import BN from 'bignumber.js';

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
			open: false,
		};
	}


	componentDidMount() {
		this.props.updateAccountAddresses();
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
			receiver: value,
			open: !this.state.open,
		});
	}

	onChange(e, value) {
		this.setState({ receiver: value });
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

	renderAccountsList() {

		const users = [{ name: this.props.accountName }];

		const acconutHeaderTitle = <div className="title">Account</div>;

		const header = [{
			className: 'dropdown-header',
			value: 'accounts-header',
			key: 'accounts-header',
			content: acconutHeaderTitle,
			disabled: true,
		}];

		const options = users.map(({
			name,
		}) => {
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

		return header.concat(options);
	}


	renderAddressesList() {
		const { addresses } = this.state;


		const users = addresses.map((a) => ({
			name: a.get('label'),
			address: a.get('address'),
		})).toArray();

		const addressHeaderTitle = (
			<div className="title">ADDRESSES</div>
		);

		const header = [{
			className: 'dropdown-header',
			value: 'address-header',
			key: 'address-header',
			content: addressHeaderTitle,
			onClick: (e) => e.stopPropagation(),
			disabled: true,
		}];

		const generateAddressItem = [{
			className: 'generate-address',
			value: 'generate-address',
			key: 'generate-address',
			content: 'Generate new address',
			onClick: () => {
				this.setState({ open: false });
				this.props.openModal(MODAL_GENERATE_ECHO_ADDRESS);
			},
			selected: false,
		}];

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

		return !options.length ?
			generateAddressItem :
			header.concat(options).concat(generateAddressItem);
	}

	render() {

		const {
			currency, fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;
		const { receiver, open } = this.state;
		const receiverValue = this.getReceiver();

		const link = this.getQrData();

		return (
			<div className="payment-wrap">
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>
				<ModalCreateEchoAddress />

				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>
				<div className="dropdown-wrap">
					<div className="dropdown-label">recipient Account OR address</div>
					<Dropdown
						placeholder="Choose account or address"
						options={this.renderAccountsList().concat(this.renderAddressesList())}
						search
						text="Choose account or address"
						searchQuery={receiver}
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
};

EchoNetwork.defaultProps = {
	currency: null,
};


export default EchoNetwork;

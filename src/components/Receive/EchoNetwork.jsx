import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { List } from 'immutable';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import Avatar from '../Avatar';
import AmountField from '../Fields/AmountField';
import QrCode from '../QrCode';


class EchoNetwork extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addresses: new List([]),
			receiver: '',
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
		});
	}

	onChange(e, value) {
		this.setState({ receiver: value });
	}

	renderAccontsList() {

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
			onClick: () => {},
			disabled: true,
		}];

		const generateAddressItem = [{
			className: 'generate-address',
			value: 'generate-address',
			key: 'generate-address',
			content: 'Generate new address',
			onClick: () => {},
			selected: false,
		}];

		const options = users.map(({
			name, address,
		}, index) => {
			const content = (
				<React.Fragment key={name} >
					<div className="address-item">
						<div className="address">{address}</div>
						<CopyToClipboard text={address}>
							<button className="dropdown-copy-btn icon-icopy-tiny" />
						</CopyToClipboard>
					</div>
					<div className="name">{name}</div>
				</React.Fragment>
			);

			return ({
				className: 'address-item-wrap',
				value: name,
				key: index.toString(),
				text: name,
				content,
				onClick: () => this.onClickItem(address),
			});
		});

		return header.concat(options).concat(generateAddressItem);
	}

	render() {

		const {
			currency, fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;
		const { receiver } = this.state;

		return (
			<div className="payment-wrap">
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>
				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>
				<div className="dropdown-wrap">
					<div className="dropdown-label">recipient Account OR address</div>
					<Dropdown
						placeholder="Choose account or address"
						options={this.renderAccontsList().concat(this.renderAddressesList())}
						search
						text="Choose account or address"
						searchQuery={receiver}
						onSearchChange={(e, { searchQuery }) => this.onChange(e, searchQuery)}
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
					assetDropdown={false}
				/>
				<QrCode />
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
	updateAccountAddresses: PropTypes.func.isRequired,
};

EchoNetwork.defaultProps = {
	currency: null,
};


export default EchoNetwork;

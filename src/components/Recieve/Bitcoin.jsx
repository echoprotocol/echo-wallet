import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import Avatar from '../../components/Avatar';
import AmountField from '../Fields/AmountField';
import AccountField from '../Fields/AccountField';
import QrCode from '../QrCode';

import { MODAL_GENERATE_ADDRESS } from '../../constants/ModalConstants';

class EchoNetwork extends React.Component {

	renderAccontsList() {

		const users = [{ name: 'valik_pruss456' }];

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

			});
		});

		return header.concat(options);
	}


	renderAddressesList() {
		const users = [
			{ name: 'Valik1', address: 'f0d6if8k5d87g5hw2ej548d3r7h4kr7fn34kj123kl4444' },
			{ name: 'Valik2', address: 'j548d3r7h4kr7ff0d6if8k5d87g5hw2en34kj123kl9999' },
			{ name: 'Valik3', address: '5hw2en34kj12j548d3r7h4kr7ff0d6if8k5d87g3kl090909' },
			{ name: 'Valik4', address: 'j548d3r7h4kr7ff0d6if8k5d87g5hw2en34kj123kl9999' },
			{ name: 'Valik5', address: '5hw2en34kj12j548d3r7h4kr7ff0d6if8k5d87g3kl090909' },
		];

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
		}) => {
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
				key: name,
				content,
				onClick: () => {},
			});
		});

		return header.concat(options).concat(generateAddressItem);
	}

	renderPayment() {

		const {
			currency, from, setIn, checkAccount,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		return (
			<React.Fragment>
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>

				<AccountField
					disabled
					field={from}
					currency={currency}
					subject="from"
					checkAccount={checkAccount}
					setIn={setIn}
					setFormValue={this.props.setFormValue}
					getTransferFee={this.props.getTransferFee}
					setContractFees={this.props.setContractFees}
					setValue={this.props.setValue}
				/>

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
						closeOnChange
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
			</React.Fragment>
		);
	}
	renderGenerateAdressProcess() {
		const { address } = this.props;

		return address ? (
			<React.Fragment>
				<h2 className="payment-header t-center">
					You should generate address<br /> to receive payment.
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
				<Button
					className="main-btn"
					content="Generate address"
					onClick={() => this.props.openModal(MODAL_GENERATE_ADDRESS)}
				/>
			</React.Fragment>
		) :
			<React.Fragment>
				<h2 className="payment-header t-center">
					Wait please, <br /> address is not ready yet
				</h2>
				<p className="payment-description t-center">
					Please, allow some time for address generation as it may take up to one hour.
					It will appear on this page when generated.
				</p>
			</React.Fragment>;
	}

	render() {


		return (
			<div className="payment-wrap" >
				{this.renderGenerateAdressProcess()}

				{/* {this.renderPayment()} */}
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
	isAvailableBalance: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	from: PropTypes.object.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	address: PropTypes.bool,
	openModal: PropTypes.func.isRequired,

};

EchoNetwork.defaultProps = {
	currency: null,
	address: true,
};


export default EchoNetwork;

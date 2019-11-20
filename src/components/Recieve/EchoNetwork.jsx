import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import Avatar from '../../components/Avatar';
import AmountField from '../Fields/AmountField';

class EchoNetwork extends React.Component {

	renderAccontsList() {

		const users = [{ name: 'valik_pruss456' }];

		const acconutHeaderTitle = (<div className="title">Account</div>);

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
			<React.Fragment>
				<div className="title">Account</div>
				<button
					onClick={() => { console.log('kokoko'); }}
					className="add-icon"
				/>
			</React.Fragment>
		);

		const header = [{
			className: 'dropdown-header',
			value: 'address-header',
			key: 'address-header',
			content: addressHeaderTitle,
			onClick: () => {},
			selected: false,
		}];

		const generateAddressItem = [{
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
							<Button icon="copy" className="dropdown-copy-btn" />
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

	render() {

		const {
			currency,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		return (
			<div className="payment-wrap">
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>
				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>
				<div className="dropdown-wrap">
					<div className="dropdown-label">recipient Account OR address</div>
					<Dropdown
						open
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
				/>
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
};

EchoNetwork.defaultProps = {
	currency: null,
};


export default EchoNetwork;

import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';
import { FORM_TRANSFER } from '../../constants/FormConstants';

import AmountField from '../Fields/AmountField';

class EchoNetwork extends React.Component {


	render() {

		const {
			currency,
			fee, assets, tokens, amount, isAvailableBalance, fees,
		} = this.props;

		const options = [
			{
				value: 'testnet',
				key: 'testnet',
				selected: true,
				content: (
					<React.Fragment>
						<div className="label-text">
							<span className="name">koko22</span>
						</div>
						<span className="label-link">koko</span>
						<Button
							id="btn-dlt"
							className="icon-remove"
						/>
					</React.Fragment>
				),
			},
		];

		return (
			<div className="payment-wrap">
				<p className="payment-description">Fill in payment information to get a unique QR code.</p>
				<p className="payment-description">
					You can use several addresses referring to one account for different targets.
				</p>
				<Dropdown
					options={options}
					search
					closeOnChange
				/>
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

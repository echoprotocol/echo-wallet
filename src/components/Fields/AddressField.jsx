/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

class AddressField extends React.Component {

	render() {
		const {
			amount, fee, assetDropdown, labelText,
		} = this.props;

		return (
			<Form.Field>
				<label htmlFor="amount">
					{labelText}
				</label>
				<Input
					type="text"
					placeholder="Address"
					tabIndex="0"
					action
					className={classnames('amount-wrap action-wrap')}
				>
					<div
						className={classnames(
							'amount-wrap',
							'action-wrap',
						)}
					>
						<input
							className="address"
							placeholder="Address"
							value={amount.value}
							name="address"
							onChange={() => {}}
							onFocus={() => {}}
							onBlur={() => {}}
						/>
						{
							this.renderErrorStaus(assetDropdown, amount.error, fee.error)
						}
					</div>
					{
						amount.error || fee.error ?
							<span className="error-message">{amount.error || fee.error}</span> : null
					}
				</Input>

			</Form.Field>
		);
	}

}

AddressField.propTypes = {
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
	receive: PropTypes.bool,
};


AddressField.defaultProps = {
	currency: null,
	fee: {},
	assets: null,
	assetDropdown: true,
	labelText: 'Amount',
	receive: false,
};

export default AddressField;

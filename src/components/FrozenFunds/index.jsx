import React from 'react';

import PropTypes from 'prop-types';

import Assets from './AssetsComponent';
import Transfer from './Transfer';

class FrozenFunds extends React.Component {

	render() {
		const {
			assets, tokens, amount, currency,
			fee, isAvailableBalance, fees, duration,
		} = this.props;

		return (
			<div>
				<div className="sub-header">
					<span className="icon-frozen-funds" />
					<span>Total Frozen Amount:</span>
					<div className="balance">
						<span>35</span>
						<span>ECHO</span>
					</div>
				</div>
				<div className="page-wrap frozen">
					<div className="balance-wrap">
						<div className="frozen-about">
							If you take part in the blocks					creation process, the sum you
							freeze will turn into a new amount after unfreezing (depending on the duration
							of freezing) when re&#8209;calculated with the coefficient and considered while
							distributing the reward.
						</div>
						<div className="balance-scroll">
							<Assets />
						</div>
					</div>
					<div className="send-wrap">
						<Transfer
							fees={fees}
							tokens={tokens}
							assets={assets}
							amount={amount}
							fee={fee}
							currency={currency}
							duration={duration}
							isAvailableBalance={isAvailableBalance}
							transfer={this.props.transfer}
							resetTransaction={this.props.resetTransaction}
							clearForm={this.props.clearForm}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setDefaultAsset={this.props.setDefaultAsset}
							setValue={this.props.setValue}
							setFormValue={this.props.setFormValue}
							getTransactionFee={this.props.getTransactionFee}
							setContractFees={this.props.setContractFees}
						/>
					</div>
				</div>
			</div>
		);
	}

}

FrozenFunds.propTypes = {
	fees: PropTypes.array.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	currency: PropTypes.object,
	duration: PropTypes.number,
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
	getTransactionFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

FrozenFunds.defaultProps = {
	currency: null,
	duration: 90,
};

export default FrozenFunds;

import React from 'react';
import PropTypes from 'prop-types';

import Assets from './AssetsComponent';
import Transfer from './Transfer';

class FrozenFunds extends React.Component {

	renderSubHeader() {

		const {
			frozenFunds, totalFrozenFunds,
		} = this.props;

		if (frozenFunds.length) {
			return (
				<div className="sub-header">
					<span className="icon-frozen-funds" />
					<span>Total Frozen Amount:</span>
					<div className="balance">
						<span>{totalFrozenFunds}</span>
						<span>ECHO</span>
					</div>
				</div>
			);
		} return null;
	}

	render() {
		const {
			frozenFunds, coreAsset,
			assets, tokens, amount, currency,
			fee, isAvailableBalance, fees, duration, activeUserId,
		} = this.props;

		return (
			<div>
				{this.renderSubHeader()}
				<div className="page-wrap frozen">
					<div className="balance-wrap">
						<div className="frozen-about">
							If you take part in the blocks					creation process, the sum you
							freeze will turn into a new amount after unfreezing (depending on the duration
							of freezing) when re&#8209;calculated with the coefficient and considered while
							distributing the reward.
						</div>
						<div className="balance-scroll">
							<Assets
								frozenFunds={frozenFunds}
								coreAsset={coreAsset}
							/>
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
							activeUserId={activeUserId}
							isAvailableBalance={isAvailableBalance}
							freezeBalance={this.props.freezeBalance}
							resetTransaction={this.props.resetTransaction}
							clearForm={this.props.clearForm}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setDefaultAsset={this.props.setDefaultAsset}
							setValue={this.props.setValue}
							setFormValue={this.props.setFormValue}
							getTransactionFee={this.props.getTransactionFee}
							setAssets={this.props.setAssets}
						/>
					</div>
				</div>
			</div>
		);
	}

}

FrozenFunds.propTypes = {
	frozenFunds: PropTypes.array.isRequired,
	totalFrozenFunds: PropTypes.string,
	coreAsset: PropTypes.object.isRequired,
	fees: PropTypes.array.isRequired,
	clearForm: PropTypes.func.isRequired,
	freezeBalance: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	currency: PropTypes.object,
	duration: PropTypes.object.isRequired,
	activeUserId: PropTypes.string.isRequired,
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
	setAssets: PropTypes.func.isRequired,
};

FrozenFunds.defaultProps = {
	currency: null,
	totalFrozenFunds: '0',
};

export default FrozenFunds;

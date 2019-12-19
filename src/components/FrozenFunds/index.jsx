import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
					<span>
						<FormattedMessage id="wallet_page.frozen_funds.total_sum_text" />
					</span>
					<div className="balance">
						<span>{totalFrozenFunds}</span>
						<span>ECHO</span>
					</div>
				</div>
			);
		}
		return null;
	}

	render() {
		const {
			frozenFunds, coreAsset,
			assets, tokens, amount, currency,
			fee, isAvailableBalance, fees, duration, activeUserId,
		} = this.props;

		return (
			<React.Fragment>
				{this.renderSubHeader()}
				<div className="page-wrap frozen">
					<div className="balance-wrap">
						<div className="frozen-about">
							<FormattedMessage id="wallet_page.frozen_funds.frozen_funds_list.description" />
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
							keyWeightWarn={this.props.keyWeightWarn}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}

}

FrozenFunds.propTypes = {
	frozenFunds: PropTypes.array,
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
	keyWeightWarn: PropTypes.bool.isRequired,
};

FrozenFunds.defaultProps = {
	currency: null,
	totalFrozenFunds: '0',
	frozenFunds: [],
};

export default FrozenFunds;

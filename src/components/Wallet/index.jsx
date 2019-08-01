import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import Assets from './AssetsComponent';
import Tokens from './TokensComponents';
import Transfer from '../Transfer';
import { MODAL_TOKENS } from '../../constants/ModalConstants';


class Wallet extends React.Component {

	render() {
		const {
			assets, tokens, accountName, from, to, amount, currency,
			fee, isAvailableBalance, fees,
		} = this.props;

		return (
			<div className="wallet-wrap">
				<div className="balance-wrap">
					<div className="balance-title-row">
						<div className="balance-title">Balances</div>
						<Button
							basic
							onClick={() => this.props.openModal(MODAL_TOKENS)}
							compact
							content="Watch Tokens"
							className="main-btn"
						/>
					</div>

					<div className="balance-scroll">
						<Assets
							assets={assets}
							setAsset={(symbol) => this.props.setAsset(symbol, 'assets')}
							setAssetActiveAccount={() => this.props.setAssetActiveAccount()}
						/>
						<Tokens
							tokens={tokens}
							setAsset={(symbol) => this.props.setAsset(symbol, 'tokens')}
							removeToken={this.props.removeToken}
							openModal={this.props.openModal}
						/>
					</div>
				</div>
				<div className="send-wrap">
					<Transfer
						fees={fees}
						tokens={tokens}
						assets={assets}
						accountName={accountName}
						from={from}
						to={to}
						amount={amount}
						fee={fee}
						currency={currency}
						isAvailableBalance={isAvailableBalance}
						transfer={this.props.transfer}
						resetTransaction={this.props.resetTransaction}
						setIn={this.props.setIn}
						checkAccount={this.props.checkAccount}
						clearForm={this.props.clearForm}
						amountInput={this.props.amountInput}
						setFormError={this.props.setFormError}
						setDefaultAsset={this.props.setDefaultAsset}
						setValue={this.props.setValue}
						setFormValue={this.props.setFormValue}
						getTransferFee={this.props.getTransferFee}
						setContractFees={this.props.setContractFees}
					/>
				</div>
			</div>
		);
	}

}

Wallet.propTypes = {
	fees: PropTypes.array.isRequired,

	amount: PropTypes.object.isRequired,
	tokens: PropTypes.object,
	assets: PropTypes.object,
	currency: PropTypes.object,
	from: PropTypes.object.isRequired,
	to: PropTypes.object.isRequired,
	fee: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	openModal: PropTypes.func.isRequired,
	removeToken: PropTypes.func.isRequired,
	setAsset: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setAssetActiveAccount: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};

Wallet.defaultProps = {
	tokens: null,
	assets: null,
	currency: null,
};

export default Wallet;

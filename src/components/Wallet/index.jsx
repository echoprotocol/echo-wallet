import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tab } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import Assets from './AssetsComponent';
import Tokens from './TokensComponents';
import StableCoins from './StableCoinsComponents';

import Transfer from '../Transfer';
import Receive from '../Receive';
import { MODAL_TOKENS } from '../../constants/ModalConstants';
import { FORM_TRANSFER } from '../../constants/FormConstants';

class Wallet extends React.Component {

	componentWillUnmount() {
		this.props.setGlobalValue('activeCoinTypeTab', 0);
	}

	render() {
		const {
			assets, tokens, accountName, from, to, amount, currency, ethAddress, keyWeightWarn, preview,
			fee, isAvailableBalance, fees, generateEthAddress, getEthAddress, additionalAccountInfo,
			bytecode, avatarName, subjectTransferType, fullCurrentAccount, accountAddresses, ethSidechain,
			btcAddress, accountId, activeCoinTypeTab, activePaymentTypeTab, sidechainAssets, echoAssets,
		} = this.props;

		const isDisplaySidechainNotification = !!((fee.asset && !!sidechainAssets
			.find((sa) => sa.symbol === fee.asset.symbol))
			|| (currency && sidechainAssets.find((sa) => sa.symbol === currency.symbol))) || false;
		const externalTabs = [
			{
				menuItem: <Button
					className="tab-btn"
					key="0"
					onClick={(e) => {
						this.props.setGlobalValue('activePaymentTypeTab', 0);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.create_payment.title" />
					}
				/>,
				render: () => (
					<div className="send-wrap">
						<Transfer
							fees={fees}
							tokens={tokens}
							assets={assets}
							accountName={accountName}
							from={from}
							to={to}
							avatarName={avatarName}
							bytecode={bytecode}
							amount={amount}
							fee={fee}
							currency={currency}
							isAvailableBalance={isAvailableBalance}
							additionalAccountInfo={additionalAccountInfo}
							subjectTransferType={subjectTransferType}
							transfer={this.props.transfer}
							resetTransaction={this.props.resetTransaction}
							setIn={this.props.setIn}
							checkAccount={this.props.checkAccount}
							clearForm={() => this.props.clearForm(FORM_TRANSFER)}
							subjectToSendSwitch={this.props.subjectToSendSwitch}
							setTransferFee={this.props.setTransferFee}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setDefaultAsset={this.props.setDefaultAsset}
							setValue={this.props.setValue}
							setFormValue={this.props.setFormValue}
							getTransferFee={this.props.getTransferFee}
							setContractFees={this.props.setContractFees}
							isDisplaySidechainNotification={isDisplaySidechainNotification}
							keyWeightWarn={keyWeightWarn}
							activeCoinTypeTab={activeCoinTypeTab}
						/>
					</div>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="1"
					onClick={(e) => {
						this.props.setGlobalValue('activePaymentTypeTab', 1);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.receive_payment.title" />
					}
				/>,
				render: () => (
					<div className="send-wrap">
						<Receive
							tokens={tokens}
							assets={assets}
							amount={amount}
							fee={fee}
							currency={currency}
							activeCoinTypeTab={activeCoinTypeTab}
							isAvailableBalance={isAvailableBalance}
							accountAddresses={accountAddresses}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setDefaultAsset={this.props.setDefaultAsset}
							setValue={this.props.setValue}
							updateAccountAddresses={this.props.updateAccountAddresses}
							setGlobalValue={this.props.setGlobalValue}
							getBtcAddress={this.props.getBtcAddress}
							btcAddress={btcAddress}
							accountName={accountName}
							accountId={accountId}
							setIn={this.props.setIn}
							checkAccount={this.props.checkAccount}
							from={from}
							clearForm={this.props.clearForm}
							openModal={(value) => this.props.openModal(value)}
							getAssetsBalances={this.props.getAssetsBalances}
							generateEthAddress={generateEthAddress}
							getEthAddress={getEthAddress}
							ethAddress={ethAddress}
							fullCurrentAccount={fullCurrentAccount}
							keyWeightWarn={keyWeightWarn}
							ethSidechain={ethSidechain}
							accounts={preview}
						/>
					</div>),
			},
		];

		return (
			<div className="page-wrap">
				<div className="balance-wrap">
					<div className="balance-title-row">
						<div className="balance-title">
							<FormattedMessage id="wallet_page.balances.title" />
						</div>
						<Button
							basic
							onClick={() => this.props.openModal(MODAL_TOKENS)}
							size="tiny"
							content={
								<FormattedMessage id="wallet_page.balances.add_erc20_token_text" />
							}
							className="main-btn"
						/>
					</div>

					<div className="balance-scroll">
						<Assets
							assets={echoAssets}
							setAsset={(symbol) => {
								this.props.setAsset(symbol, 'assets');
								this.props.getTransferFee().then((res) => {
									if (!res) {
										return;
									}
									this.props.setFormValue('fee', res.value);
								});
							}}
							setAssetActiveAccount={() => this.props.setAssetActiveAccount()}
							setGlobalValue={(field, value) => this.props.setGlobalValue(field, value)}
						/>
						<StableCoins
							assets={sidechainAssets}
							setAsset={(symbol) => {
								this.props.setAsset(symbol, 'assets');
								this.props.getTransferFee().then((res) => {
									if (!res) {
										return;
									}
									this.props.setFormValue('fee', res.value);
								});
							}}
							setGlobalValue={(field, value) => this.props.setGlobalValue(field, value)}
							activeCoinTypeTab={activeCoinTypeTab}
							activePaymentTypeTab={activePaymentTypeTab}
						/>
						<Tokens
							tokens={tokens}
							removeToken={this.props.removeToken}
							setAsset={(symbol) => {
								this.props.setAsset(symbol, 'tokens');
								this.props.setContractFees();
							}}
							setGlobalValue={(field, value) => this.props.setGlobalValue(field, value)}
						/>
					</div>
				</div>
				<Tab
					activeIndex={activePaymentTypeTab}
					menu={{
						tabular: false,
						className: 'wallet-tab-menu',
					}}
					panes={externalTabs}
				/>

			</div>
		);
	}

}

Wallet.propTypes = {
	fees: PropTypes.array.isRequired,
	amount: PropTypes.object.isRequired,
	tokens: PropTypes.object,
	assets: PropTypes.object,
	echoAssets: PropTypes.object,
	sidechainAssets: PropTypes.object,
	currency: PropTypes.object,
	btcAddress: PropTypes.object,
	from: PropTypes.object.isRequired,
	to: PropTypes.object.isRequired,
	avatarName: PropTypes.string.isRequired,
	bytecode: PropTypes.object.isRequired,
	fee: PropTypes.object.isRequired,
	accountAddresses: PropTypes.object.isRequired,
	accountName: PropTypes.string.isRequired,
	activePaymentTypeTab: PropTypes.number.isRequired,
	activeCoinTypeTab: PropTypes.any.isRequired,
	accountId: PropTypes.string.isRequired,
	subjectTransferType: PropTypes.string.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	additionalAccountInfo: PropTypes.object,
	openModal: PropTypes.func.isRequired,
	removeToken: PropTypes.func.isRequired,
	setAsset: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	subjectToSendSwitch: PropTypes.func.isRequired,
	setTransferFee: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setAssetActiveAccount: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	updateAccountAddresses: PropTypes.func.isRequired,
	getBtcAddress: PropTypes.func.isRequired,
	generateEthAddress: PropTypes.func.isRequired,
	getEthAddress: PropTypes.func.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
	getAssetsBalances: PropTypes.func.isRequired,
	ethAddress: PropTypes.object.isRequired,
	fullCurrentAccount: PropTypes.object.isRequired,
	ethSidechain: PropTypes.object.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
	preview: PropTypes.array.isRequired,
};

Wallet.defaultProps = {
	tokens: null,
	assets: null,
	echoAssets: null,
	sidechainAssets: null,
	currency: null,
	btcAddress: null,
	additionalAccountInfo: null,
};

export default Wallet;

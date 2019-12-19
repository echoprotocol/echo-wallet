import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tab, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

// import AccountField from '../Fields/AccountField';
import EchoNetwork from './EchoNetwork';
import Bitcoin from './Bitcoin';
import Ethereum from './Ethereum';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';
import { STABLE_COINS } from '../../constants/SidechainConstants';


class Receive extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
		this.props.getAssetsBalances();
	}

	getActiveCoinTypeTab() {
		const { activeCoinTypeTab } = this.props;
		switch (activeCoinTypeTab) {
			case STABLE_COINS.EBTC: return 1;
			case STABLE_COINS.EETH: return 2;
			default: return 0;
		}
	}

	render() {

		const {
			currency, checkAccount, generateEthAddress, fullCurrentAccount,
			getEthAddress, ethAddress, clearForm, keyWeightWarn,
			fee, assets, tokens, amount, isAvailableBalance, fees, accountAddresses, accountName,
			btcAddress, accountId,
		} = this.props;

		const internalTabs = [
			{
				menuItem: <Button
					className="tab-btn"
					key="0"
					onClick={(e) => {
						this.props.setGlobalValue('activeCoinTypeTab', 0);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.receive_payment.echo.title" />
					}
				/>,
				render: () => (
					<EchoNetwork
						fees={fees}
						fee={fee}
						assets={assets}
						tokens={tokens}
						amount={amount}
						currency={currency}
						isAvailableBalance={isAvailableBalance}
						accountAddresses={accountAddresses}
						accountName={accountName}
						amountInput={this.props.amountInput}
						setFormError={this.props.setFormError}
						setFormValue={this.props.setFormValue}
						setValue={this.props.setValue}
						setDefaultAsset={this.props.setDefaultAsset}
						getTransferFee={this.props.getTransferFee}
						setContractFees={this.props.setContractFees}
						openModal={(value) => this.props.openModal(value)}
						updateAccountAddresses={this.props.updateAccountAddresses}
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="1"
					onClick={(e) => {
						this.props.setGlobalValue('activeCoinTypeTab', STABLE_COINS.EBTC);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.receive_payment.btc.title" />
					}
				/>,
				render: () => (
					<Bitcoin
						// for Amount field
						amount={amount}
						amountInput={this.props.amountInput}
						// for From field
						accountAddresses={accountAddresses}
						accountName={accountName}
						accountId={accountId}
						checkAccount={checkAccount}
						openModal={(value) => this.props.openModal(value)}
						getBtcAddress={this.props.getBtcAddress}
						btcAddress={btcAddress}
						keyWeightWarn={keyWeightWarn}
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="2"
					onClick={(e) => {
						this.props.setGlobalValue('activeCoinTypeTab', STABLE_COINS.EETH);
						e.target.blur();
					}}
					content={
						<FormattedMessage id="wallet_page.receive_payment.eth.title" />
					}
				/>,
				render: () => (
					<Ethereum
						amount={amount}
						amountInput={this.props.amountInput}
						setValue={this.props.setValue}
						generateEthAddress={generateEthAddress}
						getEthAddress={getEthAddress}
						ethAddress={ethAddress}
						fullCurrentAccount={fullCurrentAccount}
						clearForm={() => clearForm(FORM_ETH_RECEIVE)}
						keyWeightWarn={keyWeightWarn}
					/>
				),
			},
		];

		return (

			<Form className="main-form">
				<div className="field-wrap">
					<Tab
						activeIndex={this.getActiveCoinTypeTab()}
						menu={{
							tabular: false,
							className: 'receive-tab-menu',
						}}
						panes={internalTabs}
					/>
				</div>
			</Form>
		);
	}

}

Receive.propTypes = {
	fees: PropTypes.array.isRequired,
	currency: PropTypes.object,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.any.isRequired,
	amount: PropTypes.object.isRequired,
	fee: PropTypes.object.isRequired,
	accountAddresses: PropTypes.object.isRequired,
	isAvailableBalance: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	updateAccountAddresses: PropTypes.func.isRequired,
	generateEthAddress: PropTypes.func.isRequired,
	getEthAddress: PropTypes.func.isRequired,
	getAssetsBalances: PropTypes.func.isRequired,
	ethAddress: PropTypes.object.isRequired,
	fullCurrentAccount: PropTypes.object.isRequired,
	getBtcAddress: PropTypes.func.isRequired,
	btcAddress: PropTypes.object,
	accountId: PropTypes.string.isRequired,
	setGlobalValue: PropTypes.func.isRequired,
	activeCoinTypeTab: PropTypes.number.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

Receive.defaultProps = {
	currency: null,
	btcAddress: null,
};

export default Receive;

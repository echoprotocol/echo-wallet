import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tab, Button } from 'semantic-ui-react';

// import AccountField from '../Fields/AccountField';
import EchoNetwork from './EchoNetwork';
import Bitcoin from './Bitcoin';
import Ethereum from './Ethereum';

import { FORM_ETH_RECEIVE } from '../../constants/FormConstants';


class Receive extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
		this.props.getAssetsBalances();
	}

	render() {

		const {
			currency, checkAccount, generateEthAddress, fullCurrentAccount,
			getEthAddress, ethAddress, clearForm,
			fee, assets, tokens, amount, isAvailableBalance, fees, accountAddresses, accountName,
			btcAddress, accountId,
		} = this.props;

		const internalTabs = [
			{
				menuItem: <Button
					className="tab-btn"
					key="0"
					onClick={(e) => e.target.blur()}
					content="ECHO NETWORK"
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
					onClick={(e) => e.target.blur()}
					content="Bitcoin"
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
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="2"
					onClick={(e) => e.target.blur()}
					content="Ethereum"
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
					/>
				),
			},
		];

		return (

			<Form className="main-form">
				<div className="field-wrap">
					<Tab
						defaultActiveIndex="0"
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
};

Receive.defaultProps = {
	currency: null,
	btcAddress: null,
};

export default Receive;

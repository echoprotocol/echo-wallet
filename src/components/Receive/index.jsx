import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tab, Button } from 'semantic-ui-react';

// import AccountField from '../Fields/AccountField';
import EchoNetwork from './EchoNetwork';
import Bitcoin from './Bitcoin';
import ModalCreateAddress from '../Modals/ModalCreateAddress';


class Receive extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	render() {

		const {
			currency, from, setIn, checkAccount,
			fee, assets, tokens, amount, isAvailableBalance, fees,
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
						// for Amount field
						fees={fees}
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
						// for From field
						from={from}
						setIn={setIn}
						checkAccount={checkAccount}
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
						fees={fees}
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
						// for From field
						from={from}
						setIn={setIn}
						checkAccount={checkAccount}
						openModal={(value) => this.props.openModal(value)}
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="2"
					onClick={(e) => e.target.blur()}
					content="Ethereum"
				/>,
				render: () => ('Ethereum'),
			},
		];

		return (

			<Form className="main-form">
				<ModalCreateAddress />
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
	// for Amount
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
	// for From field
	from: PropTypes.object.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	accountName: PropTypes.string.isRequired,
	//
	clearForm: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
};

Receive.defaultProps = {
	currency: null,
};


export default Receive;

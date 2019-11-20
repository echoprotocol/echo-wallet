import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tab, Button } from 'semantic-ui-react';
import { FORM_TRANSFER } from '../../constants/FormConstants';

// import AccountField from '../Fields/AccountField';
import EchoNetwork from './EchoNetwork';


class Recieve extends React.Component {


	componentWillUnmount() {
		this.props.clearForm();
	}

	render() {


		const {
			currency,
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
					/>),
			},
			{
				menuItem: <Button
					className="tab-btn"
					key="1"
					onClick={(e) => e.target.blur()}
					content="Bitcoin"
				/>,
				render: () => ('Bitcoin'),
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
				<div className="field-wrap">
					<Tab
						defaultActiveIndex="0"
						menu={{
							tabular: false,
							className: 'wallet-tab-menu',
						}}
						panes={internalTabs}
					/>
				</div>
			</Form>
		);
	}

}

Recieve.propTypes = {
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
	//
	clearForm: PropTypes.func.isRequired,
};

Recieve.defaultProps = {
	currency: null,
};


export default Recieve;

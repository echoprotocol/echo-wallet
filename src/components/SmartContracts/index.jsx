import React from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { SOURCE_CODE_MODE, BYTECODE_MODE } from '../../constants/ContractsConstants';

import ContractBar from './ContractBar';
import SourceCode from './SourceCode';
import Bytecode from './Bytecode';


class SmartContracts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			createType: SOURCE_CODE_MODE,
		};
	}
	onEditorLoad(editor) {
		editor.setOptions({
			fontSize: '15px',
		});
	}

	render() {
		const { createType } = this.state;
		const {
			fee, tokens, amount, currency, assets, isAvailableBalance, fees, ETHAccuracy,
		} = this.props;
		return (
			<Form className="page-wrap">
				<div className="create-contract">
					<h2 className="create-contract-title">Create Smart Contract</h2>
					<div className="radio-list">
						<Button
							className={classnames('radio', { checked: createType === SOURCE_CODE_MODE })}
							onClick={() => { this.setState({ createType: SOURCE_CODE_MODE }); }}
							content="Source code"
						/>
						<Button
							className={classnames('radio', { checked: createType === BYTECODE_MODE })}
							onClick={() => { this.setState({ createType: BYTECODE_MODE }); }}
							content="Bytecode"
						/>
					</div>
					{createType === SOURCE_CODE_MODE && <SourceCode />}
					{createType === BYTECODE_MODE && <Bytecode />}
				</div>
				<ContractBar
					fee={fee}
					fees={fees}
					tokens={tokens}
					amount={amount}
					ETHAccuracy={ETHAccuracy}
					currency={currency}
					assets={assets}
					isAvailableBalance={isAvailableBalance}
					amountInput={this.props.amountInput}
					setFormError={this.props.setFormError}
					setFormValue={this.props.setFormValue}
					setValue={this.props.setValue}
					setContractValue={this.props.setContractValue}
					getTransferFee={this.props.getTransferFee}
					setDefaultAsset={this.props.setDefaultAsset}
					setContractFees={this.props.setContractFees}
					getAssetsList={this.props.getAssetsList}
				/>
			</Form>
		);
	}

}

SmartContracts.propTypes = {
	fee: PropTypes.object,
	fees: PropTypes.array.isRequired,
	assets: PropTypes.object.isRequired,
	tokens: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	ETHAccuracy: PropTypes.bool.isRequired,
	setContractValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getAssetsList: PropTypes.func.isRequired,
};

SmartContracts.defaultProps = {
	currency: null,
	fee: null,
};


export default SmartContracts;

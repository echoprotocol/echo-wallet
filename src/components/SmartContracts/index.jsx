import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Form } from 'semantic-ui-react';

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

	async componentDidMount() {
		this.props.contractCompilerInit();
	}


	onEditorLoad(editor) {
		editor.setOptions({
			fontSize: '15px',
		});
	}

	onToggle() {
	}


	render() {
		const {
			form, amount, currency, assets, isAvailableBalance, fees, ETHAccuracy,
		} = this.props;
		const { createType } = this.state;

		return (
			<Form className="page-wrap">
				<div className="create-contract">
					<h2 className="create-contract-title">Create Smart Contract</h2>
					<div className="radio-list">
						<Button
							className={classnames('radio', { checked: createType === SOURCE_CODE_MODE })}
							onClick={() => { this.setState({ createType: SOURCE_CODE_MODE }); }}
							content="Source code"
							disabled={form.get('compileLoading')}
						/>
						<Button
							className={classnames('radio', { checked: createType === BYTECODE_MODE })}
							onClick={() => { this.setState({ createType: BYTECODE_MODE }); }}
							content="Bytecode"
							disabled={form.get('compileLoading')}
						/>
					</div>
					{createType === SOURCE_CODE_MODE &&
						<SourceCode
							form={form}
							setFormValue={this.props.setFormValue}
							contractCodeCompile={this.props.contractCodeCompile}
							clearForm={this.props.clearForm}
							changeContractCompiler={this.props.changeContractCompiler}
							setValue={this.props.setValue}
							resetCompiler={this.props.resetCompiler}
						/>}
					{createType === BYTECODE_MODE &&
						<Bytecode
							form={form}
							setFormValue={this.props.setFormValue}
						/>}
				</div>
				<ContractBar
					form={form}
					fees={fees}
					amount={amount}
					ETHAccuracy={ETHAccuracy}
					currency={currency}
					assets={assets}
					isAvailableBalance={isAvailableBalance}
					amountInput={this.props.amountInput}
					setFormError={this.props.setFormError}
					setFormValue={this.props.setFormValue}
					setValue={this.props.setValue}
					setDefaultAsset={this.props.setDefaultAsset}
					getAssetsList={this.props.getAssetsList}
					createContract={this.props.createContract}
				/>
			</Form>
		);
	}

}

SmartContracts.propTypes = {
	fees: PropTypes.array.isRequired,
	assets: PropTypes.object.isRequired,
	amount: PropTypes.object.isRequired,
	currency: PropTypes.object,
	isAvailableBalance: PropTypes.bool.isRequired,
	ETHAccuracy: PropTypes.bool.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getAssetsList: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
	contractCodeCompile: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	createContract: PropTypes.func.isRequired,
	contractCompilerInit: PropTypes.func.isRequired,
	changeContractCompiler: PropTypes.func.isRequired,
	resetCompiler: PropTypes.func.isRequired,
};

SmartContracts.defaultProps = {
	currency: null,
};


export default SmartContracts;

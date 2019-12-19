import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Form } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { SOURCE_CODE_MODE, BYTECODE_MODE } from '../../constants/ContractsConstants';

import ContractBar from './ContractBar';
import SourceCode from './SourceCode';
import Bytecode from './Bytecode';
import {
	FORM_CREATE_CONTRACT_BYTECODE,
	FORM_CREATE_CONTRACT_OPTIONS,
	FORM_CREATE_CONTRACT_SOURCE_CODE,
} from '../../constants/FormConstants';


class SmartContracts extends React.Component {

	async componentDidMount() {
		this.props.contractCompilerInit();
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_CREATE_CONTRACT_SOURCE_CODE);
		this.props.clearForm(FORM_CREATE_CONTRACT_BYTECODE);
		this.props.clearForm(FORM_CREATE_CONTRACT_OPTIONS);
	}

	onEditorLoad(editor) {
		editor.setOptions({
			fontSize: '15px',
		});
	}

	render() {
		const {
			formSourceCode, formBytecode, formOptions, assets, fees,
		} = this.props;

		return (
			<Form className="page-wrap">
				<div className="create-contract">
					<h2 className="create-contract-title">
						<FormattedMessage id="smart_contract_page.create_contract_page.title" />
					</h2>
					<div className="radio-list">
						<Button
							className={classnames('radio', { checked: formOptions.get('contractMode') === SOURCE_CODE_MODE })}
							onClick={() => this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'contractMode', SOURCE_CODE_MODE)}
							content={
								<FormattedMessage id="smart_contract_page.create_contract_page.code_type_selectors.source_code" />
							}
							disabled={formSourceCode.get('compileLoading')}
						/>
						<Button
							className={classnames('radio', { checked: formOptions.get('contractMode') === BYTECODE_MODE })}
							onClick={() => this.props.setValue(FORM_CREATE_CONTRACT_OPTIONS, 'contractMode', BYTECODE_MODE)}
							content={
								<FormattedMessage id="smart_contract_page.create_contract_page.code_type_selectors.bytecode" />
							}
							disabled={formSourceCode.get('compileLoading')}
						/>
					</div>
					{formOptions.get('contractMode') === SOURCE_CODE_MODE &&
						<SourceCode
							form={formSourceCode}
							setFormValue={this.props.setFormValue}
							contractCodeCompile={this.props.contractCodeCompile}
							changeContractCompiler={this.props.changeContractCompiler}
							setValue={this.props.setValue}
							resetCompiler={this.props.resetCompiler}
							setDefaultAsset={this.props.setDefaultAsset}
						/>}
					{formOptions.get('contractMode') === BYTECODE_MODE &&
						<Bytecode
							form={formBytecode}
							setFormValue={this.props.setFormValue}
							setDefaultAsset={this.props.setDefaultAsset}
						/>}
				</div>
				<ContractBar
					form={formOptions}
					fees={fees}
					assets={assets}
					amountInput={this.props.amountInput}
					setFormError={this.props.setFormError}
					setFormValue={this.props.setFormValue}
					setValue={this.props.setValue}
					setDefaultAsset={this.props.setDefaultAsset}
					getAssetsList={this.props.getAssetsList}
					createContract={this.props.createContract}
					keyWeightWarn={this.props.keyWeightWarn}
				/>
			</Form>
		);
	}

}

SmartContracts.propTypes = {
	fees: PropTypes.array.isRequired,
	assets: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	amountInput: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
	getAssetsList: PropTypes.func.isRequired,
	formSourceCode: PropTypes.object.isRequired,
	formBytecode: PropTypes.object.isRequired,
	formOptions: PropTypes.object.isRequired,
	contractCodeCompile: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	createContract: PropTypes.func.isRequired,
	contractCompilerInit: PropTypes.func.isRequired,
	changeContractCompiler: PropTypes.func.isRequired,
	resetCompiler: PropTypes.func.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};


export default SmartContracts;

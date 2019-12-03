import { connect } from 'react-redux';

import SmartContracts from '../../components/SmartContracts';

import {
	setContractFees,
	getAssetsList,
	contractCodeCompile,
	contractCompilerInit,
	changeContractCompiler,
	resetCompiler,
} from '../../actions/ContractActions';
import {
	FORM_CREATE_CONTRACT_BYTECODE,
	FORM_CREATE_CONTRACT_SOURCE_CODE,
	FORM_CREATE_CONTRACT_OPTIONS,
} from '../../constants/FormConstants';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setValue, setFormError, setFormValue, clearForm } from '../../actions/FormActions';
import { getTransferFee, createContract } from '../../actions/TransactionActions';

export default connect(
	(state) => ({
		formSourceCode: state.form.get(FORM_CREATE_CONTRACT_SOURCE_CODE),
		formBytecode: state.form.get(FORM_CREATE_CONTRACT_BYTECODE),
		formOptions: state.form.get(FORM_CREATE_CONTRACT_OPTIONS),
		fees: state.fee.toArray() || [],
		assets: state.balance.get('assets'),
	}),
	(dispatch) => ({
		setValue: (form, field, value) => dispatch(setValue(form, field, value)),
		setFormValue: (form, field, value) => dispatch(setFormValue(form, field, value)),
		setFormError: (form, field, error) => dispatch(setFormError(form, field, error)),
		setContractFees: (form) => dispatch(setContractFees(form)),
		setDefaultAsset: (form) => dispatch(setDefaultAsset(form)),
		getTransferFee: (form, asset) => dispatch(getTransferFee(form, asset)),
		amountInput: (form, value, currency, name) =>
			dispatch(amountInput(form, value, currency, name)),
		getAssetsList: (name) => getAssetsList(name),
		contractCodeCompile: (code) => dispatch(contractCodeCompile(code)),
		clearForm: (form) => dispatch(clearForm(form)),
		createContract: () => dispatch(createContract()),
		contractCompilerInit: () => dispatch(contractCompilerInit()),
		changeContractCompiler: (version) => dispatch(changeContractCompiler(version)),
		resetCompiler: () => dispatch(resetCompiler()),
	}),
)(SmartContracts);


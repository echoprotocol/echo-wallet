import { connect } from 'react-redux';

import SmartContracts from '../../components/SmartContracts';

import {
	setContractFees,
	getAssetsList,
	contractCodeCompile,
	contractCompilerInit,
	changeContractCompiler,
} from '../../actions/ContractActions';
import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setValue, setFormError, setFormValue, clearForm } from '../../actions/FormActions';
import { getTransferFee, createContract } from '../../actions/TransactionActions';

export default connect(
	(state) => ({
		form: state.form.get(FORM_CREATE_CONTRACT),
		fees: state.fee.toArray() || [],
		assets: state.balance.get('assets'),
		amount: state.form.getIn([FORM_CREATE_CONTRACT, 'amount']),
		currency: state.form.getIn([FORM_CREATE_CONTRACT, 'currency']),
		isAvailableBalance: state.form.getIn([FORM_CREATE_CONTRACT, 'isAvailableBalance']),
		ETHAccuracy: state.form.getIn([FORM_CREATE_CONTRACT, 'ETHAccuracy']),
	}),
	(dispatch) => ({
		setValue: (field, value) => dispatch(setValue(FORM_CREATE_CONTRACT, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_CREATE_CONTRACT, field, error)),
		setContractFees: () => dispatch(setContractFees(FORM_CREATE_CONTRACT)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_CREATE_CONTRACT)),
		getTransferFee: (asset) => dispatch(getTransferFee(FORM_CREATE_CONTRACT, asset)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_CREATE_CONTRACT, value, currency, name)),
		getAssetsList: (name) => getAssetsList(name),
		contractCodeCompile: (code) => dispatch(contractCodeCompile(code)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
		createContract: () => dispatch(createContract()),
		contractCompilerInit: () => dispatch(contractCompilerInit()),
		changeContractCompiler: (version) => dispatch(changeContractCompiler(version)),
	}),
)(SmartContracts);


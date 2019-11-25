import { connect } from 'react-redux';
import SmartContracts from '../../components/SmartContracts';
import { set as setContractValue, setContractFees, getAssetsList } from '../../actions/ContractActions';
import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setValue, setFormError, setFormValue } from '../../actions/FormActions';
import { getTransferFee } from '../../actions/TransactionActions';

export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		fee: state.form.getIn([FORM_CREATE_CONTRACT, 'fee']),
		tokens: state.balance.get('tokens'),
		assets: state.balance.get('assets'),
		amount: state.form.getIn([FORM_CREATE_CONTRACT, 'amount']),
		currency: state.form.getIn([FORM_CREATE_CONTRACT, 'currency']),
		isAvailableBalance: state.form.getIn([FORM_CREATE_CONTRACT, 'isAvailableBalance']),
		ETHAccuracy: state.contract.get('ETHAccuracy'),
	}),
	(dispatch) => ({
		setContractValue: (param, value) => dispatch(setContractValue(param, value)),
		setValue: (field, value) => dispatch(setValue(FORM_CREATE_CONTRACT, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_CREATE_CONTRACT, field, error)),
		setContractFees: () => dispatch(setContractFees(FORM_CREATE_CONTRACT)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_CREATE_CONTRACT)),
		getTransferFee: (asset) => dispatch(getTransferFee(FORM_CREATE_CONTRACT, asset)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_CREATE_CONTRACT, value, currency, name)),
		getAssetsList: (name) => getAssetsList(name),
	}),
)(SmartContracts);


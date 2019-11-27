import { connect } from 'react-redux';

import SmartContracts from '../../components/SmartContracts';
import { contractCodeCompile } from '../../actions/ContractActions';
import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';
import { clearForm, setFormValue } from '../../actions/FormActions';

export default connect(
	(state) => ({
		form: state.form.get(FORM_CREATE_CONTRACT),
	}),
	(dispatch) => ({
		contractCodeCompile: (code) => dispatch(contractCodeCompile(code)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
	}),
)(SmartContracts);


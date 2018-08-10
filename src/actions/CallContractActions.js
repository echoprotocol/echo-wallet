import { FORM_CALL_CONTRACT } from '../constants/FormConstants';

import { setFormValue, clearForm, setInFormValue, setValue } from './FormActions';

export const setFunction = (functionName) => (dispatch, getState) => {
	const functions = getState().contract.get('functions') || [];

	const targetFunction = functions.find((f) => (f.name === functionName));

	if (!targetFunction) return;

	dispatch(clearForm(FORM_CALL_CONTRACT));

	targetFunction.inputs.forEach((i) => {
		dispatch(setInFormValue(FORM_CALL_CONTRACT, ['inputs', i.name], ''));
	});

	dispatch(setFormValue(FORM_CALL_CONTRACT, 'functionName', functionName));
	if (!targetFunction.payable) return;

	dispatch(setValue(FORM_CALL_CONTRACT, 'payable', true));
};

export const callMethod = () => (dispatch, getState) => {

	dispatch(setValue(FORM_CALL_CONTRACT, 'loading', true));

	const functions = getState().contract.get('functions').toJS();
	const functionForm = getState().form.get(FORM_CALL_CONTRACT).toJS();

	const targetFunction = functions.find((f) => f.name === functionForm.functionName);

	if (!targetFunction) return;

	const isErrorExist = false;
    const args = targetFunction.inputs.map((i) => {
    	const fieldName = i.name;
    	const fieldType = i.type;
		return functionForm.inputs[fieldName].value;
	});

    console.log(args);


	dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
};


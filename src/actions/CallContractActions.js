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

export const callMethod = () => () => {

};


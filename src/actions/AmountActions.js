import { setFormValue, setValue, setFormError } from './FormActions';

const amountInput = (form, value, currency, name) => (dispatch) => {
	if (!value.match(/^[0-9]*[.,]?[0-9]*$/)) {
		dispatch(setFormError(form, 'amount', 'Amount must contain only digits and dot'));

	} else if (value.replace(',', '.') !== '' && !Math.floor(value.replace(',', '.') * (10 ** currency.precision))) {
		dispatch(setValue(
			form,
			'amount',
			{
				error: `Amount should be more than ${1 / (10 ** currency.precision)}`,
				value,
			},
		));

	} else {
		dispatch(setFormValue(form, name, value));
	}
};

export default amountInput;

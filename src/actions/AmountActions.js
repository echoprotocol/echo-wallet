import { setFormValue, setFormError } from './FormActions';

export const amountInput = (form, value, currency, name) => (dispatch) => {
	if (!value.match(/^[0-9]*[.,]?[0-9]*$/)) {
		dispatch(setFormError(form, 'amount', 'Amount must contain only digits and dot'));
		return;
	}

	if (value.replace(',', '.') !== '' && !Math.floor(value.replace(',', '.') * (10 ** currency.precision))) {
		dispatch(setFormError(
			form,
			'amount',
			`Amount should be more than 0 (${currency.symbol} precision is ${currency.precision} symbols)`,
		));
	}

	if (/\.|,/.test(value)) {
		const [intPath, doublePath] = value.split(/\.|,/);
		value = `${intPath ? Number(intPath) : ''}.${doublePath || ''}`;
	} else {
		value = value ? Number(value).toString() : value;
	}

	dispatch(setFormValue(form, name, value));
};

export default {};

import BN from 'bignumber.js';

import Services from '../services';
import { setFormValue, setFormError, setValue } from './FormActions';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

/**
 * @method amountInput
 *
 * @param {String} form
 * @param {String} value
 * @param {Object} currency
 * @param {string} name
 * @returns {function(dispatch, getState): Promise<undefined>}
 *  */
export const amountInput = (form, value, currency, name) => (dispatch) => {
	if (!value.match(/^[0-9]*[.,]?[0-9]*$/)) {
		dispatch(setFormError(form, 'amount', 'errors.amount_errors.incorrect_input_error'));
		return;
	}

	if (+value !== 0 && value.replace(',', '.') !== '' && !Math.floor(value.replace(',', '.') * (10 ** currency.precision))) {
		dispatch(setFormError(
			form,
			'amount',
			'errors.amount_errors.zero_amount_error',
		));
		return;
	}


	if (/\.|,/.test(value)) {
		const [intPath, doublePath] = value.split(/\.|,/);
		value = `${intPath ? Number(intPath) : ''}.${doublePath || ''}`;
	} else {
		value = value ? new BN(value).toString(10) : value;
	}

	dispatch(setFormValue(form, name, value));
};

/**
 * @method setDefaultAsset
 *
 * @param {String} form
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setDefaultAsset = (form) => async (dispatch, getState) => {
	const currency = getState().form.getIn([form, 'currency']);

	if (currency) {
		return;
	}

	if (!Services.getEcho().api) {
		return;
	}

	let defaultAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);

	const assets = getState().balance.get('assets');
	const asset = assets.find((value) => value.id === ECHO_ASSET_ID);

	defaultAsset = {
		balance: asset ? asset.balance : 0,
		id: defaultAsset.id,
		symbol: defaultAsset.symbol,
		precision: defaultAsset.precision,
	};

	dispatch(setValue(form, 'currency', defaultAsset));
};

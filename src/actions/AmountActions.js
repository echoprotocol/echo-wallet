import { EchoJSActions } from 'echojs-redux';
import { setFormValue, setFormError, setValue } from './FormActions';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';
import { FORM_TRANSFER } from '../constants/FormConstants';

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

	dispatch(setFormError(form, 'fee', null));
	dispatch(setFormValue(form, name, value));
};

export const setDefaultAsset = (form) => async (dispatch, getState) => {
	let defaultAsset = await dispatch(EchoJSActions.fetch(ECHO_ASSET_ID));

	const assets = getState().balance.get('assets');
	const assetsFromTransfer = getState().form.getIn([FORM_TRANSFER, 'balance', 'assets']);
	const isWalletAccount = getState().form.getIn([FORM_TRANSFER, 'isWalletAccount']);

	const targetAssets = !isWalletAccount && form === FORM_TRANSFER ? assetsFromTransfer : assets;

	const asset = targetAssets.find((value) => 	value.id === ECHO_ASSET_ID);

	defaultAsset = {
		balance: asset ? asset.balance : 0,
		id: defaultAsset.get('id'),
		symbol: defaultAsset.get('symbol'),
		precision: defaultAsset.get('precision'),
	};

	dispatch(setValue(form, 'currency', defaultAsset));
};

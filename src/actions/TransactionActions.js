import BN from 'bignumber.js';
import { EchoJSActions } from 'echojs-redux';

import operations from '../constants/Operations';
import { FORM_TRANSFER } from '../constants/FormConstants';
import { toggleLoading, setFormError, setValue, setIn } from './FormActions';

import { validateAccountName } from '../helpers/AuthHelper';
import { validateAccountExist } from '../api/WalletApi';
import { buildAndSendTransaction } from '../api/TransactionApi';

export const getFee = (type, assetId = '1.3.0') => (dispatch, getState) => {
	const globalObject = getState().echojs.getIn(['data', 'objects', '2.0.0']);

	if (!globalObject) { return null; }

	const code = operations[type].value;
	let fee = globalObject.getIn(['parameters', 'current_fees', 'parameters', code, 1, 'fee']);

	let feeAsset = getState().echojs.getIn(['data', 'assets', '1.3.0']);

	if (!feeAsset) { return null; }

	feeAsset = feeAsset.toJS();

	if (assetId !== '1.3.0') {
		const coreAsset = feeAsset;
		feeAsset = getState().echojs.getIn(['data', 'assets', assetId]);

		if (!feeAsset) { return null; }

		feeAsset = feeAsset.toJS();

		const { quote, base } = feeAsset.options.core_exchange_rate;
		base.precision = base.asset_id === assetId ? feeAsset.precision : coreAsset.precision;
		quote.precision = quote.asset_id === assetId ? feeAsset.precision : coreAsset.precision;


		const price = new BN(quote.amount)
			.div(base.amount)
			.times(10 ** (base.precision - quote.precision));

		fee = price.times(fee);
	}

	return { value: String(fee), asset: feeAsset };
};

export const checkAccount = (accountName) => async (dispatch, getState) => {
	let accountNameError = validateAccountName(accountName);

	if (accountNameError) {
		dispatch(setFormError(FORM_TRANSFER, 'to', accountNameError));
		dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
		return;
	}

	try {
		const instance = getState().echojs.getIn(['system', 'instance']);
		accountNameError = await validateAccountExist(instance, accountName, true);

		if (accountNameError) {
			dispatch(setFormError(FORM_TRANSFER, 'to', accountNameError));
			dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
			return;
		}

		dispatch(setIn(FORM_TRANSFER, 'to', { checked: true }));
	} catch (err) {
		dispatch(setValue(FORM_TRANSFER, 'error', err));
	} finally {
		dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
	}


};

export const transfer = () => async (dispatch, getState) => {
	const {
		to, amount, currency, fee, comment,
	} = getState().form.get(FORM_TRANSFER).toJS();

	//	TODO check account balance

	dispatch(toggleLoading(FORM_TRANSFER, true));

	const fromAccountId = getState().global.getIn(['activeUser', 'id']);
	const toAccountId = (await dispatch(EchoJSActions.fetch(to))).toJS().id;

	//	TODO check transfer token or asset

	const options = {
		fee: {
			amount: fee.value,
			asset_id: fee.asset.id,
		},
		from: fromAccountId,
		to: toAccountId,
		amount: { amount: amount.value, asset_id: currency.id },
	};

	if (comment.value) {
		// TODO hendle memo
	}

	buildAndSendTransaction('transfer', options);
};

import BN from 'bignumber.js';
import { EchoJSActions } from 'echojs-redux';
import { Map } from 'immutable';

import operations from '../constants/Operations';
import { FORM_TRANSFER, FORM_TRANSACTION_DETAILS } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';

import { openModal, closeModal } from './ModalActions';
import { toggleLoading, setFormError, setValue, setIn, clearForm } from './FormActions';

import { validateAccountName } from '../helpers/AuthHelper';

import { validateAccountExist } from '../api/WalletApi';
import { buildAndSendTransaction } from '../api/TransactionApi';
import { buildAndMakeRequest } from '../api/ContractApi'; //	/////

import TransactionReducer from '../reducers/TransactionReducer';

export const setTransactionValue = (field, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.set({ field, value }));
};

export const setInTransactionValue = (fields, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.setIn({ fields, value }));
};
export const resetTransactionValues = () => (dispatch) => {
	dispatch(TransactionReducer.actions.reset());
};

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

export const createContract = ({ bytecode }) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);

	if (!activeUserId || !activeUserName) return;

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) return;

	dispatch(resetTransactionValues());

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);

	const options = {
		registrar: activeUserId,
		asset_id: '1.3.0',
		value: 0,
		gasPrice: 0,
		gas: 100000,
		code: bytecode,
	};

	dispatch(setTransactionValue('transaction', new Map(options)));
	dispatch(setTransactionValue('operation', 'contract'));

	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setTransactionValue('privateKey', privateKey));
		dispatch(openModal(MODAL_DETAILS));
	}

	dispatch(setTransactionValue('onBuild', true));
};

export const makeRequest = (details) => (dispatch) => {
	details = details.toJS();
	const { operation, privateKey, transaction } = details;
	buildAndMakeRequest(operation, transaction, privateKey);
	dispatch(closeModal(MODAL_DETAILS));
	dispatch(clearForm(FORM_TRANSACTION_DETAILS));
	dispatch(resetTransactionValues());
};

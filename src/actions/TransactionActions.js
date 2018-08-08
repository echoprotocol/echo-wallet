import BN from 'bignumber.js';
import { EchoJSActions } from 'echojs-redux';

import history from '../history';

import operations from '../constants/Operations';
import { FORM_CREATE_CONTRACT, FORM_TRANSFER } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';
import { INDEX_PATH } from '../constants/RouterConstants';

import { openModal, closeModal } from './ModalActions';
import { toggleLoading, setFormError, setValue, setIn } from './FormActions';
import ToastActions from '../actions/ToastActions';

import { validateAccountName } from '../helpers/AuthHelper';
import { validateCode, validateAbi, validateContractName } from '../helpers/TransactionHelper';

import { validateAccountExist } from '../api/WalletApi';
import { buildAndSendTransaction, getMemo, getMemoFee } from '../api/TransactionApi';

import TransactionReducer from '../reducers/TransactionReducer';
import { addContractByName } from './ContractActions';

export const resetTransaction = () => (dispatch) => {
	dispatch(TransactionReducer.actions.reset());
};

export const setField = (field, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.set({ field, value }));
};

export const fetchFee = (type) => async (dispatch) => {
	const globalObject = await dispatch(EchoJSActions.fetch('2.0.0'));
	const asset = await dispatch(EchoJSActions.fetch('1.3.0'));

	const value = globalObject.getIn([
		'parameters',
		'current_fees',
		'parameters',
		operations[type].value,
		1,
		'fee',
	]);

	return { value, asset: asset.toJS() };
};

export const getFee = (type, assetId = '1.3.0', memo = null) => (dispatch, getState) => {
	const globalObject = getState().echojs.getIn(['data', 'objects', '2.0.0']);

	if (!globalObject) { return null; }

	const code = operations[type].value;
	let fee = globalObject.getIn(['parameters', 'current_fees', 'parameters', code, 1, 'fee']);

	if (memo) {
		fee = new BN(fee).plus(getMemoFee(globalObject, memo));
	}

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

	return { value: new BN(fee).integerValue().toString(), asset: feeAsset };
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
	const form = getState().form.get(FORM_TRANSFER).toJS();

	const {
		to, amount, currency, comment,
	} = form;
	let { fee } = form;

	if (to.error || amount.error || fee.error || comment.error) {
		return;
	}

	if (!to.value) {
		dispatch(setFormError(FORM_TRANSFER, 'to', 'Account name should not be empty'));
		return;
	}

	if (!Math.floor(amount.value * (10 ** currency.precision))) {
		dispatch(setFormError(FORM_TRANSFER, 'amount', `Amount should be more than ${1 / (10 ** currency.precision)}`));
		return;
	}

	if (new BN(amount.value).times(10 ** currency.precision).gt(currency.balance)) {
		dispatch(setFormError(FORM_TRANSFER, 'amount', 'Insufficient funds'));
		return;
	}

	if (!fee.value || !fee.asset) {
		fee = dispatch(getFee('transfer', '1.3.0', comment.value));
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount.value).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds'));
			return;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds'));
			return;
		}
	}

	dispatch(toggleLoading(FORM_TRANSFER, true));

	const fromAccountId = getState().global.getIn(['activeUser', 'id']);
	const fromAccount = (await dispatch(EchoJSActions.fetch(fromAccountId))).toJS();
	const toAccount = (await dispatch(EchoJSActions.fetch(to.value))).toJS();

	//	TODO check transfer token or asset

	const options = {
		fee: {
			amount: fee.value,
			asset_id: fee.asset.id,
		},
		from: fromAccountId,
		to: toAccount.id,
		amount: {
			amount: amount.value * (10 ** currency.precision),
			asset_id: currency.id,
		},
	};

	const showOptions = {
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		from: fromAccount.name,
		to: toAccount.name,
		amount: `${amount.value} ${currency.symbol}`,
	};

	if (comment.value) {
		options.memo = comment.value;
		showOptions.comment = comment.value;
	}

	const activePubKey = fromAccount.active.key_auths[0][0];
	const memoPubKey = fromAccount.options.memo_key;
	if (!activePubKey || !memoPubKey) return;

	dispatch(resetTransaction());

	const activePrivateKey = getState().keychain.getIn([activePubKey, 'privateKey']);
	const memoPrivateKey = getState().keychain.getIn([memoPubKey, 'privateKey']);

	dispatch(TransactionReducer.actions.setOperation({ operation: 'transfer', options, showOptions }));

	if (!activePrivateKey || !memoPrivateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setField('keys', {
			active: activePrivateKey,
			memo: memoPrivateKey,
		}));

		dispatch(openModal(MODAL_DETAILS));
	}

};

export const createContract = ({ bytecode, name, abi }) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);
	if (!activeUserId || !activeUserName) return;

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) return;

	const error = validateCode(bytecode);

	if (error) {
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'bytecode', error));
		return;
	}

	if (getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList'])) {
		const nameError = validateContractName(name);
		const abiError = validateAbi(abi);

		if (nameError) {
			dispatch(setFormError(FORM_CREATE_CONTRACT, 'name', nameError));
			return;
		}

		if (abiError) {
			dispatch(setFormError(FORM_CREATE_CONTRACT, 'abi', abiError));
			return;
		}
	}

	dispatch(resetTransaction());

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);

	const options = {
		registrar: activeUserId,
		asset_id: '1.3.0',
		value: 0,
		gasPrice: 0,
		gas: 4700000,
		code: bytecode,
	};

	const fee = await dispatch(fetchFee('contract'));

	const showOptions = {
		from: activeUserName,
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode,
	};

	dispatch(TransactionReducer.actions.setOperation({ operation: 'contract', options, showOptions }));

	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setField('keys', { active: privateKey }));
		dispatch(openModal(MODAL_DETAILS));
	}

};

export const validateContractForm = ({ name, abi }) => async (dispatch) => {
	const nameError = validateContractName(name);
	const abiError = validateAbi(abi);

	if (nameError) {
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'name', nameError));
		return;
	}

	if (abiError) {
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'abi', abiError));

	}
};

export const sendTransaction = () => async (dispatch, getState) => {
	const { operation, keys, options } = getState().transaction.toJS();

	if (options.memo) {
		const fromAccount = (await dispatch(EchoJSActions.fetch(options.from))).toJS();
		const toAccount = (await dispatch(EchoJSActions.fetch(options.to))).toJS();

		options.memo = getMemo(fromAccount, toAccount, options.memo, keys.memo);
	}

	buildAndSendTransaction(operation, options, keys.active)
		.then(() => {
			ToastActions.toastSuccess(`${operations[operation].name} transaction was sent`);

			if (getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList'])) {
				dispatch(addContractByName());
			}
		})
		.catch(() => {
			ToastActions.toastError(`${operations[operation].name} transaction wasn't sent`);
		});

	dispatch(closeModal(MODAL_DETAILS));

	history.push(INDEX_PATH);

	dispatch(resetTransaction());
};

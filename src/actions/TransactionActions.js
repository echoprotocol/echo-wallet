import BN from 'bignumber.js';
import { EchoJSActions } from 'echojs-redux';

import history from '../history';

import operations from '../constants/Operations';
import {
	FORM_CREATE_CONTRACT,
	FORM_TRANSFER,
	FORM_CALL_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
} from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';
import {INDEX_PATH, CONTRACT_LIST_PATH, ACTIVITY_PATH} from '../constants/RouterConstants';

import { openModal, closeModal, setDisable } from './ModalActions';
import {
	toggleLoading,
	setFormError,
	setValue,
	setIn,
	setInFormError,
} from './FormActions';


import { getMethod } from '../helpers/ContractHelper';
import { toastSuccess, toastError } from '../helpers/ToastHelper';
import {
	validateCode,
	validateAbi,
	validateContractName,
	validateByType,
	validateAmount,
	validateFee,
	validateContractId,
} from '../helpers/ValidateHelper';

import { validateAccountExist } from '../api/WalletApi';
import {
	buildAndSendTransaction,
	estimateCallContractFee,
	encodeMemo,
	getMemoFee,
} from '../api/TransactionApi';

import TransactionReducer from '../reducers/TransactionReducer';
import { addContractByName } from './ContractActions';

export const resetTransaction = () => (dispatch) => {
	dispatch(TransactionReducer.actions.reset());
};

export const setField = (field, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.set({ field, value }));
};

export const setNote = ({ note, unlocked, error }) => (dispatch) => {
	dispatch(TransactionReducer.actions.setNote({ note, unlocked, error }));
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

export const getFee = (type, assetId = '1.3.0', note = null) => (dispatch, getState) => {
	const globalObject = getState().echojs.getIn(['data', 'objects', '2.0.0']);
	if (!globalObject) { return null; }

	const code = operations[type].value;
	let fee = globalObject.getIn(['parameters', 'current_fees', 'parameters', code, 1, 'fee']);

	if (note) {
		fee = new BN(fee).plus(getMemoFee(globalObject, note));
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

		const price = new BN(quote.amount)
			.div(base.amount)
			.times(10 ** (coreAsset.precision - feeAsset.precision));

		fee = new BN(fee).div(10 ** coreAsset.precision);
		fee = price.times(fee).times(10 ** feeAsset.precision);
	}

	return { value: new BN(fee).integerValue(BN.ROUND_UP).toString(), asset: feeAsset };
};

export const checkFeePool = (echo, asset, fee) => {
	if (echo.id === asset.id) { return true; }

	let feePool = new BN(asset.dynamic.fee_pool).div(10 ** echo.precision);

	const { quote, base } = asset.options.core_exchange_rate;
	const precision = echo.precision - asset.precision;
	const price = new BN(quote.amount).div(base.amount).times(10 ** precision);
	feePool = price.times(feePool).times(10 ** asset.precision);

	return feePool.gt(fee);
};

export const checkAccount = (accountName) => async (dispatch, getState) => {
	if (!accountName) {
		dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
		return;
	}

	try {
		const instance = getState().echojs.getIn(['system', 'instance']);
		const accountNameError = await validateAccountExist(instance, accountName, true);

		if (accountNameError) {
			dispatch(setFormError(FORM_TRANSFER, 'to', accountNameError));
			dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
			return;
		}

		dispatch(setIn(FORM_TRANSFER, 'to', {
			checked: true,
			error: null,
		}));
	} catch (err) {
		dispatch(setValue(FORM_TRANSFER, 'error', err));
	} finally {
		dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
	}


};

export const transfer = () => async (dispatch, getState) => {
	const form = getState().form.get(FORM_TRANSFER).toJS();

	const { to, currency, note } = form;
	let { fee } = form;
	const amount = Number(form.amount.value).toString();

	if (to.error || form.amount.error || fee.error || note.error) {
		return;
	}

	if (!to.value) {
		dispatch(setFormError(FORM_TRANSFER, 'to', 'Account name should not be empty'));
		return;
	}

	const amountError = validateAmount(amount, currency);

	if (amountError) {
		dispatch(setFormError(FORM_TRANSFER, 'amount', amountError));
		return;
	}

	if (!fee.value || !fee.asset) {
		fee = dispatch(currency.type === 'tokens' ? getFee('transfer', '1.3.0', note.value) : getFee('contract'));
	}

	const echo = getState().echojs.getIn(['data', 'assets', '1.3.0']).toJS();
	const feeAsset = getState().echojs.getIn(['data', 'assets', fee.asset.id]).toJS();

	if (!checkFeePool(echo, feeAsset, fee.value)) {
		dispatch(setFormError(
			FORM_TRANSFER,
			'fee',
			`${fee.asset.symbol} fee pool balance is less than fee amount`,
		));
		return;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds for fee'));
			return;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds for fee'));
			return;
		}
	}

	dispatch(toggleLoading(FORM_TRANSFER, true));

	const fromAccountId = getState().global.getIn(['activeUser', 'id']);
	const fromAccount = (await dispatch(EchoJSActions.fetch(fromAccountId))).toJS();
	const toAccount = (await dispatch(EchoJSActions.fetch(to.value))).toJS();

	let options = {};

	if (currency.type === 'tokens') {
		const code = getMethod(
			{
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
			},
			[toAccount.id, amount * (10 ** currency.precision)],
		);

		options = {
			registrar: fromAccountId,
			receiver: currency.id,
			asset_id: fee.asset.id,
			value: 0,
			gasPrice: 0,
			gas: 4700000,
			code,
		};
	} else {
		options = {
			fee: {
				amount: fee.value,
				asset_id: fee.asset.id,
			},
			from: fromAccountId,
			to: toAccount.id,
			amount: {
				amount: amount * (10 ** currency.precision),
				asset_id: currency.id,
			},
		};
	}

	const showOptions = {
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		from: fromAccount.name,
		to: toAccount.name,
		amount: `${amount} ${currency.symbol}`,
	};

	if (note.value && currency.type !== 'tokens') {
		options.memo = note.value;
		showOptions.note = note.value;
	}

	const activePubKey = fromAccount.active.key_auths[0][0];
	const memoPubKey = fromAccount.options.memo_key;
	if (!activePubKey || !memoPubKey) return;

	dispatch(resetTransaction());

	const activePrivateKey = getState().keychain.getIn([activePubKey, 'privateKey']);
	const memoPrivateKey = getState().keychain.getIn([memoPubKey, 'privateKey']);

	dispatch(TransactionReducer.actions.setOperation({
		operation: currency.type === 'tokens' ? 'contract' : 'transfer',
		options,
		showOptions,
	}));

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

export const estimateFormFee = (asset, form) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);


	if (!activeUserId) return 0;

	let contractId = '1.16.1';
	let amountValue = 0;
	let bytecode = '';

	if (form === FORM_CALL_CONTRACT) {
		contractId = getState().contract.get('id') || contractId;
		const functions = getState().contract.get('functions').toJS();
		const functionForm = getState().form.get(FORM_CALL_CONTRACT).toJS();

		const targetFunction = functions.find((f) => f.name === functionForm.functionName);
		if (!targetFunction) return 0;

		const args = targetFunction.inputs.map((i) => {
			const { name: field } = i;
			const { value } = functionForm.inputs[field];
			return value;
		});

		bytecode = getMethod(targetFunction, args);

		const { amount, currency } = functionForm;
		let { payable } = functionForm;

		if ((payable && (!amount || !currency)) || !asset) {
			payable = false;
		}

		if (payable && !validateAmount(amount, currency)) {
			amountValue = amount.value * (10 ** currency.precision);
		}
	} else if (form === FORM_CALL_CONTRACT_VIA_ID) {
		const formValues = getState().form.get(FORM_CALL_CONTRACT_VIA_ID).toJS();
		contractId = formValues.id.value || contractId;
		bytecode = formValues.bytecode.value;

		const { amount, currency } = formValues;

		if (amount.value) {
			const amountError = validateAmount(amount.value, currency);
			if (!amountError) {
				amountValue = amount.value * (10 ** currency.precision);
			}
		}
	}

	const options = {
		registrar: activeUserId,
		receiver: contractId,
		asset_id: asset.id,
		value: amountValue,
		gasPrice: 0,
		gas: 4700000,
		code: bytecode,
	};

	const feeValue = await estimateCallContractFee('contract', options);

	return feeValue;
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

	const feeValue = await estimateCallContractFee('contract', options);

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
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

export const sendTransaction = () => async (dispatch, getState) => {

	dispatch(setDisable(MODAL_DETAILS, true));

	const { operation, keys, options } = getState().transaction.toJS();

	if (options.memo) {
		const fromAccount = (await dispatch(EchoJSActions.fetch(options.from))).toJS();
		const toAccount = (await dispatch(EchoJSActions.fetch(options.to))).toJS();

		options.memo = encodeMemo(fromAccount, toAccount, options.memo, keys.memo);
	}

	const addToWatchList = getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList']);
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const name = getState().form.getIn([FORM_CREATE_CONTRACT, 'name']).value;
	const abi = getState().form.getIn([FORM_CREATE_CONTRACT, 'abi']).value;
	const bytecode =
		getState().form.getIn([FORM_CREATE_CONTRACT, 'bytecode']).value ||
		getState().form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'bytecode']).value;

	buildAndSendTransaction(operation, options, keys.active)
		.then((res) => {
			if (addToWatchList) {
				dispatch(addContractByName(
					res[0].trx.operation_results[0][1],
					accountId,
					name,
					abi,
				));
			}

			toastSuccess(`${operations[operation].name} transaction was completed`);
		})
		.catch((error) => {
			error = error.toString();
			let message = error.substring(error.indexOf(':') + 2, error.indexOf('\n'));
			message = message.charAt(0).toUpperCase() + message.slice(1);
			toastError(`${operations[operation].name} transaction wasn't completed. ${message}`);
		})
		.finally(() => dispatch(setDisable(MODAL_DETAILS, false)));
	toastSuccess(`${operations[operation].name} transaction was sent`);

	dispatch(closeModal(MODAL_DETAILS));

	history.push(bytecode ? CONTRACT_LIST_PATH : ACTIVITY_PATH);

	dispatch(resetTransaction());
};

export const callContract = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);
	const contractId = getState().contract.get('id');

	// check exist account and contract
	if (!activeUserId || !activeUserName || !contractId) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return;
	}
	const functions = getState().contract.get('functions').toJS();
	const functionForm = getState().form.get(FORM_CALL_CONTRACT).toJS();

	const targetFunction = functions.find((f) => f.name === functionForm.functionName);

	// check our function exist
	if (!targetFunction) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return;
	}

	// validate fields
	let isErrorExist = false;
	const args = targetFunction.inputs.map((i) => {
		const { type, name: field } = i;
		const { value } = functionForm.inputs[field];
		const error = validateByType(value, type);
		if (error) {
			dispatch(setInFormError(FORM_CALL_CONTRACT, ['inputs', field], error));
			isErrorExist = true;
		}
		return value;
	});

	if (isErrorExist) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return;
	}

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return;
	}

	dispatch(resetTransaction());

	const { amount, currency, payable } = functionForm;
	let { fee } = functionForm;

	// if method payable check amount and currency
	if ((payable && (!amount || !currency)) || !fee) return;

	let amountValue = 0;

	if (payable) {
		// validate amount
		const amountError = validateAmount(amount.value, currency);
		if (amountError) {
			dispatch(setValue(FORM_CALL_CONTRACT, 'amount', amountError));
			dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
			return;
		}
		amountValue = amount.value * (10 ** currency.precision);
	}

	// validate fee
	if (!fee.value || !fee.asset) {
		fee = await dispatch(getFee('contract'));
	}

	const assets = getState().balance.get('assets').toArray();
	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'amount', feeError));
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return;
	}

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);
	const bytecode = getMethod(targetFunction, args);

	const options = {
		registrar: activeUserId,
		receiver: contractId,
		asset_id: fee.asset.id,
		value: amountValue,
		gasPrice: 0,
		gas: 4700000,
		code: bytecode,
	};
	const feeValue = await estimateCallContractFee('contract', options);

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode,
	};

	if (payable) {
		showOptions.value = `${amount.value} ${currency.symbol}`;
	}

	dispatch(TransactionReducer.actions.setOperation({ operation: 'contract', options, showOptions }));

	dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setField('keys', { active: privateKey }));
		dispatch(openModal(MODAL_DETAILS));
	}

};

export const callContractViaId = () => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);

	if (!activeUserId || !activeUserName) return;

	const form = getState().form.get(FORM_CALL_CONTRACT_VIA_ID).toJS();
	const { bytecode, id } = form;

	const bytecodeError = validateCode(bytecode.value);

	if (bytecodeError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'bytecode', bytecodeError));
		return;
	}

	const contractIdError = validateContractId(id.value);

	if (contractIdError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'id', contractIdError));
		return;
	}

	dispatch(resetTransaction());

	const { amount, currency } = form;
	let { fee } = form;

	// if method payable check amount and currency
	if (!amount || !currency || !fee) return;

	let amountValue = 0;

	if (amount.value) {
		const amountError = validateAmount(amount.value, currency);
		if (amountError) {
			dispatch(setValue(FORM_CALL_CONTRACT, 'amount', amountError));
			return;
		}
		amountValue = amount.value * (10 ** currency.precision);
	}

	// validate fee
	if (!fee.value || !fee.asset) {
		fee = await dispatch(getFee('contract'));
	}

	const assets = getState().balance.get('assets').toArray();
	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'amount', feeError));
		return;
	}

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) return;

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);

	const options = {
		registrar: activeUserId,
		receiver: id.value,
		asset_id: fee.asset.id,
		value: amountValue,
		gasPrice: 0,
		gas: 4700000,
		code: bytecode.value,
	};

	const feeValue = await estimateCallContractFee('contract', options);

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode.value,
	};

	showOptions.value = `${amount.value} ${currency.symbol}`;

	dispatch(TransactionReducer.actions.setOperation({ operation: 'contract', options, showOptions }));

	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setField('keys', { active: privateKey }));
		dispatch(openModal(MODAL_DETAILS));
	}

};

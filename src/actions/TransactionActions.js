import BN from 'bignumber.js';
import { EchoJSActions } from 'echojs-redux';
import { List } from 'immutable';

import history from '../history';

import operations from '../constants/Operations';
import {
	FORM_CREATE_CONTRACT,
	FORM_TRANSFER,
	FORM_CALL_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
} from '../constants/FormConstants';
import { MODAL_DETAILS } from '../constants/ModalConstants';
import { CONTRACT_LIST_PATH, ACTIVITY_PATH } from '../constants/RouterConstants';
import { ERROR_FORM_TRANSFER } from '../constants/FormErrorConstants';
import { ECHO_ASSET_ID } from '../constants/GlobalConstants';

import { closeModal, setDisable } from './ModalActions';
import {
	toggleLoading,
	setFormError,
	setValue,
	setIn,
	setInFormError,
} from './FormActions';
import { addContractByName } from './ContractActions';
import { getBalanceFromAssets } from './BalanceActions';

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
import { formatError } from '../helpers/FormatHelper';

import { validateAccountExist } from '../api/WalletApi';
import {
	buildAndSendTransaction,
	estimateCallContractFee,
	encodeMemo,
	getMemoFee,
	getOperationFee,
} from '../api/TransactionApi';

import TransactionReducer from '../reducers/TransactionReducer';

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

export const getFee = (type, note = null) => async (dispatch, getState) => {
	const formOptions = getState().form.get(FORM_TRANSFER);

	if (!formOptions.get('amount').value || !formOptions.get('to').value) {
		return null;
	}

	const toAccountId = (await dispatch(EchoJSActions.fetch(formOptions.get('to').value))).get('id');
	const fromAccountId = getState().global.getIn(['activeUser', 'id']);

	const options = {
		amount: {
			amount: formOptions.get('amount').value,
			asset_id: formOptions.get('currency').id,
		},
		from: fromAccountId,
		to: toAccountId,
	};

	if (note) {
		options.memo = note;
	}

	const fee = getState().echojs.getIn(['data', 'assets', formOptions.get('fee').asset.id]);
	const core = getState().echojs.getIn(['data', 'assets', '1.3.0']);

	let amount = await getOperationFee(type, options, core);

	if (fee.get('id') !== '1.3.0') {
		const price = new BN(fee.getIn(['options', 'core_exchange_rate', 'quote', 'amount']))
			.div(fee.getIn(['options', 'core_exchange_rate', 'base', 'amount']))
			.times(10 ** (core.precision - fee.get('precision')));

		amount = new BN(amount).div(10 ** core.precision);
		amount = price.times(amount).times(10 ** fee.get('precision'));
	}

	return {
		value: new BN(amount).integerValue(BN.ROUND_UP).toString(),
		asset: fee.toJS(),
	};
};

export const getFeeSync = (type, assetId = '1.3.0', note = null) => (dispatch, getState) => {

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

export const updateFee = (type, note = null) => async (dispatch) => {
	if (note) {
		const fee = dispatch(getFee(type, note));
		fee.then((value) => {
			if (value) {
				dispatch(setValue(FORM_TRANSFER, 'fee', value));
			}
		});
	}

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

export const checkAccount = (accountName, subject) => async (dispatch, getState) => {
	try {
		if (!accountName) return false;

		const opositeSubject = subject === 'to' ? 'from' : 'to';

		const {
			value: opositeAccountName,
			error: opositeAccountError,
		} = getState().form.getIn([FORM_TRANSFER, opositeSubject]);

		const instance = getState().echojs.getIn(['system', 'instance']);
		const accountNameError = await validateAccountExist(instance, accountName, true);

		if (opositeAccountError && opositeAccountError === ERROR_FORM_TRANSFER.ERROR_SEND_TO_YOURSELF) {
			dispatch(setIn(FORM_TRANSFER, opositeSubject, { error: null }));
		}

		dispatch(setIn(FORM_TRANSFER, subject, {
			checked: true,
			error: null,
		}));

		if (accountNameError) {
			dispatch(setFormError(FORM_TRANSFER, subject, accountNameError));
			return false;
		}

		if (opositeAccountName === accountName) {
			dispatch(setFormError(FORM_TRANSFER, subject, ERROR_FORM_TRANSFER.ERROR_SEND_TO_YOURSELF));
			return false;
		}

		if (subject === 'to') {
			return true;
		}

		const activeUserName = getState().global.getIn(['activeUser', 'name']);

		let defaultAsset = null;
		let balances = [];

		if (activeUserName === accountName) {
			balances = getState().balance.get('assets').toArray();
			([defaultAsset] = balances);
			dispatch(setValue(FORM_TRANSFER, 'isWalletAccount', true));
		} else {
			const account = await dispatch(EchoJSActions.fetch(accountName));
			const assets = account.get('balances').toJS();
			balances = await dispatch(getBalanceFromAssets(assets));
			([defaultAsset] = balances);
			dispatch(setIn(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
			dispatch(setValue(FORM_TRANSFER, 'isWalletAccount', false));
		}

		if (!defaultAsset) {
			defaultAsset = await dispatch(EchoJSActions.fetch(ECHO_ASSET_ID));

			defaultAsset = {
				balance: 0,
				id: defaultAsset.get('id'),
				symbol: defaultAsset.get('symbol'),
				precision: defaultAsset.get('precision'),
			};
		}

		const currency = getState().form.getIn([FORM_TRANSFER, 'currency']);
		const fee = getState().form.getIn([FORM_TRANSFER, 'fee']);

		if (!balances.find((b) => b.id === fee.asset.id)) {
			const { value: note } = getState().form.getIn([FORM_TRANSFER, 'note']);
			const type = 'transfer';
			const defaultFee = await dispatch(getFeeSync(type, defaultAsset.id, note));
			dispatch(setValue(FORM_TRANSFER, 'fee', defaultFee));
		}

		const newAsset = balances.find((b) => b.id === currency.id) || defaultAsset;
		dispatch(setValue(FORM_TRANSFER, 'currency', newAsset));

	} catch (err) {
		dispatch(setValue(FORM_TRANSFER, 'error', formatError(err)));
	} finally {
		dispatch(setIn(FORM_TRANSFER, subject, { loading: false }));
	}
	return true;
};

export const transfer = () => async (dispatch, getState) => {
	const form = getState().form.get(FORM_TRANSFER).toJS();

	const {
		from,
		to,
		currency,
		note,
	} = form;

	let { fee } = form;
	const amount = new BN(form.amount.value).toString();

	if (to.error || from.error || form.amount.error || fee.error || note.error) {
		return false;
	}

	if (!from.value) {
		dispatch(setFormError(FORM_TRANSFER, 'from', 'Account name should not be empty'));
		return false;
	}

	if (!to.value) {
		dispatch(setFormError(FORM_TRANSFER, 'to', 'Account name should not be empty'));
		return false;
	}

	const amountError = validateAmount(amount, currency);

	if (amountError) {
		dispatch(setFormError(FORM_TRANSFER, 'amount', amountError));
		return false;
	}

	if (!fee.value || !fee.asset) {
		fee = dispatch(currency.type === 'tokens' ? getFeeSync('transfer', '1.3.0', note.value) : getFeeSync('call_contract'));
	}

	const echo = getState().echojs.getIn(['data', 'assets', '1.3.0']).toJS();
	const feeAsset = getState().echojs.getIn(['data', 'assets', fee.asset.id]).toJS();

	if (!checkFeePool(echo, feeAsset, fee.value)) {
		dispatch(setFormError(
			FORM_TRANSFER,
			'fee',
			`${fee.asset.symbol} fee pool balance is less than fee amount`,
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds for fee'));
			return false;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'Insufficient funds for fee'));
			return false;
		}
	}

	dispatch(toggleLoading(FORM_TRANSFER, true));

	const fromAccount = (await dispatch(EchoJSActions.fetch(from.value))).toJS();
	const toAccount = (await dispatch(EchoJSActions.fetch(to.value))).toJS();

	let options = {};

	if (currency.type === 'tokens') {
		const code = getMethod(
			{
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
			},
			[toAccount.id, new BN(amount).times(10 ** currency.precision).toString()],
		);

		options = {
			fee: { asset_id: '1.3.0', amount: 0 },
			registrar: fromAccount.id,
			value: { amount: 0, asset_id: '1.3.0' },
			code,
			callee: currency.id,
		};
	} else {
		options = {
			fee: {
				amount: fee.value,
				asset_id: fee.asset.id,
			},
			from: fromAccount.id,
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

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: currency.type === 'tokens' ? 'call_contract' : 'transfer',
		options,
		showOptions,
	}));

	return true;
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
	} else if (form === FORM_TRANSFER) {

		const formValues = getState().form.get(FORM_TRANSFER).toJS();

		const { currency } = formValues;

		if (!currency || !currency.precision) return 0;

		const amount = Number(formValues.amount.value || 0).toString();

		bytecode = getMethod(
			{
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
			},
			['1.2.1', amount * (10 ** currency.precision)],
		);
	}

	const options = {
		fee: { asset_id: asset.id, amount: 0 },
		registrar: activeUserId,
		value: { amount: amountValue, asset_id: '1.3.0' },
		code: bytecode,
		callee: contractId,
	};

	let feeValue;
	try {
		feeValue = await estimateCallContractFee('call_contract', options);
	} catch (error) {
		return null;
	}

	return feeValue;
};

export const createContract = () => async (dispatch, getState) => {
	const { bytecode, name, abi } = getState().form.get(FORM_CREATE_CONTRACT).toJS();

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);
	if (!activeUserId || !activeUserName) {
		return false;
	}

	const error = validateCode(bytecode.value);

	if (error) {
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'bytecode', error));
		return false;
	}

	if (getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList'])) {
		const nameError = validateContractName(name.value);
		const abiError = validateAbi(abi.value);

		if (nameError) {
			dispatch(setFormError(FORM_CREATE_CONTRACT, 'name', nameError));
			return false;
		}

		if (abiError) {
			dispatch(setFormError(FORM_CREATE_CONTRACT, 'abi', abiError));
			return false;
		}
	}

	dispatch(resetTransaction());

	const options = {
		asset_id: '1.3.0',
		registrar: activeUserId,
		value: { amount: 0, asset_id: '1.3.0' },
		code: bytecode.value,
		eth_accuracy: true,
		supported_asset_id: '1.3.0',
	};

	const fee = await dispatch(fetchFee('create_contract'));
	const feeValue = await estimateCallContractFee('create_contract', options);

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode.value,
	};

	dispatch(TransactionReducer.actions.setOperation({ operation: 'create_contract', options, showOptions }));

	return true;
};

export const sendTransaction = (keys) => async (dispatch, getState) => {
	dispatch(setDisable(MODAL_DETAILS, true));

	const { operation, options } = getState().transaction.toJS();

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

	const privateKeys = keys.active.map(([privateKey]) => privateKey);
	buildAndSendTransaction(operation, options, privateKeys)
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
		return false;
	}
	const functions = getState().contract.get('functions').toJS();
	const functionForm = getState().form.get(FORM_CALL_CONTRACT).toJS();

	const targetFunction = functions.find((f) => f.name === functionForm.functionName);

	// check our function exist
	if (!targetFunction) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return false;
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
		return false;
	}

	dispatch(resetTransaction());
	const { amount, currency, payable } = functionForm;
	let { fee } = functionForm;

	// if method payable check amount and currency
	if ((payable && (!amount || !currency)) || !fee) {
		return false;
	}

	let amountValue = 0;
	if (payable) {
		// validate amount
		const amountError = validateAmount(amount.value, currency);
		if (amountError) {
			dispatch(setFormError(FORM_CALL_CONTRACT, 'amount', amountError));
			dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
			return false;
		}
		amountValue = amount.value * (10 ** currency.precision);
	}

	// validate fee
	if (!fee.value || !fee.asset) {
		fee = await dispatch(getFeeSync('call_contract'));
	}

	const assets = getState().balance.get('assets').toArray();
	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setFormError(FORM_CALL_CONTRACT, 'amount', feeError));
		dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));
		return false;
	}

	// const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);
	const bytecode = getMethod(targetFunction, args);

	const options = {
		asset_id: fee.asset.id,
		registrar: activeUserId,
		value: { amount: amountValue, asset_id: '1.3.0' },
		code: bytecode,
		callee: contractId,
	};

	let feeValue;
	try {
		feeValue = await estimateCallContractFee('call_contract', options);
	} catch (error) {
		dispatch(setFormError(FORM_CALL_CONTRACT, 'fee', 'Can\'t be calculated'));
		return false;
	}

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode,
	};

	if (payable) {
		showOptions.value = `${amount.value} ${currency.symbol}`;
	}

	dispatch(TransactionReducer.actions.setOperation({ operation: 'call_contract', options, showOptions }));

	dispatch(setValue(FORM_CALL_CONTRACT, 'loading', false));

	return true;
};

export const callContractViaId = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);

	if (!activeUserId || !activeUserName) {
		return false;
	}

	const form = getState().form.get(FORM_CALL_CONTRACT_VIA_ID).toJS();

	const { bytecode, id } = form;

	if (id.error || bytecode.error) {
		return false;
	}

	const bytecodeError = validateCode(bytecode.value);

	if (bytecodeError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'bytecode', bytecodeError));
		return false;
	}

	const contractIdError = validateContractId(id.value);

	if (contractIdError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'id', contractIdError));
		return false;
	}

	dispatch(resetTransaction());

	const { amount, currency } = form;
	let { fee } = form;

	// if method payable check amount and currency
	if (!amount || !currency || !fee) {
		return false;
	}

	let amountValue = 0;

	if (amount.value) {
		const amountError = validateAmount(amount.value, currency);
		if (amountError) {
			dispatch(setValue(FORM_CALL_CONTRACT, 'amount', amountError));
			return false;
		}
		amountValue = amount.value * (10 ** currency.precision);
	}

	// validate fee
	if (!fee.value || !fee.asset) {
		fee = await dispatch(getFeeSync('call_contract'));
	}

	const assets = getState().balance.get('assets').toArray();
	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'amount', feeError));
		return false;
	}

	const options = {
		asset_id: fee.asset.id,
		registrar: activeUserId,
		value: { amount: amountValue, asset_id: '1.3.0' },
		code: bytecode.value,
		callee: id.value,
	};

	let feeValue;
	try {
		feeValue = await estimateCallContractFee('call_contract', options);
	} catch (error) {
		dispatch(setInFormError(FORM_CALL_CONTRACT_VIA_ID, ['fee', 'error'], 'Can\'t be calculated'));
		return false;
	}

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode.value,
	};

	showOptions.value = `${amount.value} ${currency.symbol}`;

	dispatch(TransactionReducer.actions.setOperation({ operation: 'call_contract', options, showOptions }));

	return true;
};

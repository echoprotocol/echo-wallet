import BN from 'bignumber.js';
import { List } from 'immutable';

import { TransactionBuilder } from 'echojs-lib';
import { EchoJSActions } from 'echojs-redux';

import history from '../history';

import operations from '../constants/Operations';
import {
	FORM_CREATE_CONTRACT,
	FORM_TRANSFER,
	FORM_CALL_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
} from '../constants/FormConstants';
import { COMMITTEE_TABLE } from '../constants/TableConstants';
import { MODAL_DETAILS } from '../constants/ModalConstants';
import { CONTRACT_LIST_PATH, ACTIVITY_PATH } from '../constants/RouterConstants';
import { ERROR_FORM_TRANSFER } from '../constants/FormErrorConstants';
import { CONTRACT_ID_PREFIX, ECHO_ASSET_ID } from '../constants/GlobalConstants';

import { closeModal, toggleLoading as toggleModalLoading } from './ModalActions';
import {
	toggleLoading,
	setFormError,
	setValue,
	setIn,
	setInFormError,
} from './FormActions';
import { addContractByName } from './ContractActions';
import { getBalanceFromAssets } from './BalanceActions';
import { setValue as setTableValue } from './TableActions';
import { signTransaction } from './SignActions';

import { getMethod } from '../helpers/ContractHelper';
import { toastSuccess, toastError } from '../helpers/ToastHelper';
import {
	validateCode,
	validateAbi,
	validateContractName,
	validateByType,
	validateAmount,
	validateContractId,
	validateFee,
} from '../helpers/ValidateHelper';
import { formatError } from '../helpers/FormatHelper';

import { validateAccountExist } from '../api/WalletApi';
import { getOperationFee } from '../api/TransactionApi';

import TransactionReducer from '../reducers/TransactionReducer';

export const resetTransaction = () => (dispatch) => {
	dispatch(TransactionReducer.actions.reset());
};

export const setField = (field, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.set({ field, value }));
};

const getTransactionFee = (form, type, options) => async (dispatch, getState) => {
	try {
		const { fee } = options;

		const core = getState().echojs.getIn(['data', 'assets', ECHO_ASSET_ID]).toJS();
		const feeAsset = await dispatch(EchoJSActions.fetch(fee.asset_id));

		let amount = await getOperationFee(type, options);

		if (feeAsset.get('id') !== ECHO_ASSET_ID) {
			const price = new BN(feeAsset.getIn(['options', 'core_exchange_rate', 'quote', 'amount']))
				.div(feeAsset.getIn(['options', 'core_exchange_rate', 'quote', 'amount']))
				.times(10 ** (core.precision - feeAsset.get('precision')));

			amount = new BN(amount).div(10 ** core.precision);
			amount = price.times(amount).times(10 ** feeAsset.get('precision'));
		}

		return {
			value: new BN(amount).integerValue(BN.ROUND_UP).toString(),
			asset: feeAsset.toJS(),
		};
		// eslint-disable-next-line no-empty
	} catch (err) {

	}

	return null;
};

export const getTransferFee = (form, asset) => async (dispatch, getState) => {
	const formOptions = getState().form.get(form);

	if (!formOptions.get('to').value) {
		dispatch(setValue(form, 'isAvailableBalance', false));
		return null;
	}

	const toAccountId = (await dispatch(EchoJSActions.fetch(formOptions.get('to').value))).get('id');
	const fromAccountId = getState().global.getIn(['activeUser', 'id']);

	const options = {
		amount: {
			amount: formOptions.get('amount').value || 0,
			asset_id: asset || formOptions.get('currency').id,
		},
		from: fromAccountId,
		to: toAccountId,
		fee: {
			amount: 0,
			asset_id: asset || formOptions.get('currency').id,
		},
	};

	dispatch(setValue(form, 'isAvailableBalance', true));
	return dispatch(getTransactionFee(form, 'transfer', options));
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
		const importsAccount = getState().balance.get('preview');

		const importingAccount = importsAccount.find((account) => account.name === accountName);

		if (!importingAccount) {
			dispatch(setFormError(FORM_TRANSFER, subject, ERROR_FORM_TRANSFER.ERROR_SEND_FROM_IN_ACTIVE));
			return false;
		}

		let defaultAsset = null;
		let balances = [];

		if (activeUserName === accountName) {
			balances = getState().balance.get('assets').toArray();
			([defaultAsset] = balances);
			dispatch(setValue(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
		} else {
			const account = await dispatch(EchoJSActions.fetch(accountName));
			const assets = account.get('balances').toJS();
			balances = await dispatch(getBalanceFromAssets(assets));
			([defaultAsset] = balances);
			dispatch(setIn(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
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

		if (fee && fee.asset && !balances.find((b) => b.id === fee.asset.id)) {
			const defaultFee = await dispatch(getTransferFee(FORM_TRANSFER, operations.transfer.value));
			if (defaultFee) {
				dispatch(setValue(FORM_TRANSFER, 'fee', defaultFee));
			}
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
	} = form;

	let { fee } = form;
	const amount = new BN(form.amount.value).toString();

	if (to.error || from.error || form.amount.error || fee.error) {
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
		fee = await dispatch(getTransferFee(FORM_TRANSFER));
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
				amount: new BN(amount).times(10 ** currency.precision).toString(),
				asset_id: currency.id,
			},
		};
	}

	const precision = new BN(10).pow(fee.asset.precision);
	const showOptions = {
		fee: `${new BN(fee.value).div(precision).toString(10)} ${fee.asset.symbol}`,
		from: fromAccount.name,
		to: toAccount.name,
		amount: `${amount} ${currency.symbol}`,
	};

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: currency.type === 'tokens' ? 'contract_call' : 'transfer',
		options,
		showOptions,
	}));

	return true;
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
		registrar: activeUserId,
		value: { amount: 0, asset_id: '1.3.0' },
		fee: { amount: 0, asset_id: '1.3.0' },
		code: bytecode.value,
		eth_accuracy: true,
		supported_asset_id: '1.3.0',
	};

	try {
		const fee = await dispatch(getTransactionFee(FORM_CREATE_CONTRACT, 'contract_create', options));

		if (fee) {
			dispatch(setValue(FORM_CREATE_CONTRACT, 'fee', fee));
		}

		const showOptions = {
			from: activeUserName,
			fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
			code: bytecode.value,
		};

		dispatch(TransactionReducer.actions.setOperation({ operation: 'contract_create', options, showOptions }));

		return true;
	} catch (err) {
		dispatch(setFormError(FORM_CREATE_CONTRACT, 'bytecode', 'Incorrect bytecode'));
		return false;
	}
};

export const sendTransaction = (password) => async (dispatch, getState) => {
	const isConnected = getState().echojs.getIn(['system', 'isConnected']);
	const { operation, options } = getState().transaction.toJS();

	if (!isConnected) {
		toastError(`${operations[operation].name} transaction wasn't completed. Please, check your connection.`);
		dispatch(closeModal(MODAL_DETAILS));
		return;
	}

	dispatch(toggleModalLoading(MODAL_DETAILS, true));

	const addToWatchList = getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList']);
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const name = getState().form.getIn([FORM_CREATE_CONTRACT, 'name']).value;
	const abi = getState().form.getIn([FORM_CREATE_CONTRACT, 'abi']).value;
	const bytecode =
		getState().form.getIn([FORM_CREATE_CONTRACT, 'bytecode']).value ||
		getState().form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'bytecode']).value;

	const tr = new TransactionBuilder();

	tr.add_type_operation(operation, options);

	await tr.set_required_fees(options.fee.asset_id);

	try {
		const signer = options[operations[operation].signer];
		await dispatch(signTransaction(signer, tr, password));
		tr.broadcast().then((res) => {
			if (addToWatchList) {
				dispatch(addContractByName(
					res[0].trx.operation_results[0][1],
					accountId,
					name,
					abi,
				));
			}
			if (res[0].trx.operations[0][0] === operations.account_update.value) {
				dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
			}

			toastSuccess(`${operations[operation].name} transaction was completed`);
		}).catch((error) => {
			error = error.toString();
			let message = error.substring(error.indexOf(':') + 2, error.indexOf('\n'));
			message = (message.charAt(0).toUpperCase() + message.slice(1));
			toastError(`${operations[operation].name} transaction wasn't completed. ${message}`);
			dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
		}).finally(() => dispatch(toggleModalLoading(MODAL_DETAILS, false)));
	} catch (error) {
		toastError(`${operations[operation].name} transaction wasn't completed. ${error.message}`);
		dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
	}
	toastSuccess(`${operations[operation].name} transaction was sent`);
	history.push(bytecode ? CONTRACT_LIST_PATH : ACTIVITY_PATH);

	dispatch(closeModal(MODAL_DETAILS));
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

	if ((payable && (!amount || !currency))) {
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
	// const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);
	const bytecode = getMethod(targetFunction, args);

	const options = {
		registrar: activeUserId,
		value: { amount: amountValue, asset_id: '1.3.0' },
		fee: { amount: 0, asset_id: '1.3.0' },
		code: bytecode,
		callee: contractId,
	};

	let feeValue;
	try {
		feeValue = await dispatch(getTransactionFee(FORM_CALL_CONTRACT, 'contract_call', options));
	} catch (error) {
		dispatch(setFormError(FORM_CALL_CONTRACT, 'fee', 'Can\'t be calculated'));
		return false;
	}

	const showOptions = {
		from: activeUserName,
		fee: `${feeValue.value / (10 ** feeValue.asset.precision)} ${feeValue.asset.symbol}`,
		code: bytecode,
	};

	if (payable) {
		showOptions.value = `${amount.value} ${currency.symbol}`;
	}

	dispatch(TransactionReducer.actions.setOperation({ operation: 'contract_call', options, showOptions }));

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
	const { fee } = form;

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

	// if method payable check amount and currency

	if (!currency || !fee || !fee.value) {
		return false;
	}

	if (!amount) {
		amount.value = 0;
	}

	const assets = getState().balance.get('assets').toArray();

	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setValue(FORM_CALL_CONTRACT, 'amount', feeError));
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

	const options = {
		fee: { asset_id: fee.asset.id, amount: fee.value },
		registrar: activeUserId,
		value: { amount: amountValue, asset_id: '1.3.0' },
		code: bytecode.value,
		callee: id.value,
	};

	const showOptions = {
		from: activeUserName,
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecode.value,
	};

	showOptions.value = `${amount.value} ${currency.symbol}`;

	dispatch(TransactionReducer.actions.setOperation({ operation: 'contract_call', options, showOptions }));

	return true;
};

export const setAssetActiveAccount = () => (dispatch, getState) => {
	const balances = getState().balance.get('assets');
	dispatch(setValue(FORM_TRANSFER, 'balance', { assets: new List((balances.toJS())) }));
};

export const estimateFormFee = (asset, form) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) return 0;

	let contractId = `${CONTRACT_ID_PREFIX}.1`;
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

		if (!currency || !currency.precision || !formValues.amount.value) return 0;

		contractId = currency.id;

		const amount = BN(formValues.amount.value).toString();

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

	let feeValue = null;
	try {
		feeValue = await dispatch(getTransactionFee(form, 'contract_call', options));
	} catch (error) {
		return null;
	}

	return feeValue ? feeValue.value : null;
};

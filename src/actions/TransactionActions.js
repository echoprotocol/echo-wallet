import BN from 'bignumber.js';
import { List } from 'immutable';

import echo, { CACHE_MAPS, validators, constants } from 'echojs-lib';

import history from '../history';

import operations from '../constants/Operations';
import {
	FORM_CREATE_CONTRACT,
	FORM_TRANSFER,
	FORM_CALL_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
	FORM_FREEZE,
	FORM_PERMISSION_KEY,
} from '../constants/FormConstants';
import { COMMITTEE_TABLE, PERMISSION_TABLE } from '../constants/TableConstants';
import { MODAL_DETAILS } from '../constants/ModalConstants';
import { CONTRACT_LIST_PATH, ACTIVITY_PATH, PERMISSIONS_PATH } from '../constants/RouterConstants';
import { ERROR_FORM_TRANSFER } from '../constants/FormErrorConstants';
import { CONTRACT_ID_PREFIX, FREEZE_BALANCE_PARAMS } from '../constants/GlobalConstants';

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
import { setValue as setTableValue, setError } from './TableActions';
import { signTransaction } from './SignActions';

import { getMethod } from '../helpers/ContractHelper';
import { toastSuccess, toastError } from '../helpers/ToastHelper';
import {
	validateCode,
	validateAbi,
	validateContractName,
	validateByType,
	validateAmount,
	validateFee,
} from '../helpers/ValidateHelper';
import { formatError } from '../helpers/FormatHelper';

import { validateAccountExist } from '../api/WalletApi';
import { getOperationFee } from '../api/TransactionApi';
import TransactionReducer from '../reducers/TransactionReducer';

/**
 * @method resetTransaction
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const resetTransaction = () => (dispatch) => {
	dispatch(TransactionReducer.actions.reset());
};
/**
 * @method setField
 * @param {String} field
 * @param {any} value
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setField = (field, value) => (dispatch) => {
	dispatch(TransactionReducer.actions.set({ field, value }));
};

/**
 * @method getTransactionFee
 *
 * @param {String} form
 * @param {String} type
 * @param {Object} options
 * @@returns {function(dispatch, getState): Promise<(Object | null)>}
 */
const getTransactionFee = (form, type, options) => async (dispatch, getState) => {
	try {
		const { fee } = options;

		const precision = getState()
			.echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, constants.ECHO_ASSET_ID]).get('precision');
		const feeAsset = await echo.api.getObject(fee.asset_id);

		let amount = await getOperationFee(type, options);

		if (feeAsset.id !== constants.ECHO_ASSET_ID) {
			const price = new BN(feeAsset.options.core_exchange_rate.quote.amount)
				.div(feeAsset.options.core_exchange_rate.quote.amount)
				.times(10 ** (precision - feeAsset.precision));

			amount = new BN(amount).div(10 ** precision);
			amount = price.times(amount).times(10 ** feeAsset.precision);
		}

		return {
			value: new BN(amount).integerValue(BN.ROUND_UP).toString(10),
			asset: feeAsset,
		};
	} catch (err) {
		console.debug('getTransactionFee -> ', err);
		return null;
	}
};
/**
 * @method getFreezeBalanceFee
 *
 * @param {String} form
 * @param {String} asset
 * @returns {function(dispatch, getState): Promise<(Object | null)>}
 */
export const getFreezeBalanceFee = (form, asset) => async (dispatch, getState) => {
	const formOptions = getState().form.get(form);

	const amount = formOptions.get('amount').value || '0';

	let amountValue = 0;
	const currency = formOptions.get('currency');

	if (currency) {
		const amountError = validateAmount(amount, currency);
		if (!amountError) {
			amountValue = new BN(amount).times(new BN(10).pow(currency.precision)).toString(10);
		}
	}

	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	const options = {
		account: activeUserId,
		duration: formOptions.get('duration').value || FREEZE_BALANCE_PARAMS[0].duration,
		amount: {
			amount: amountValue,
			asset_id: constants.ECHO_ASSET_ID,
		},
		fee: {
			asset_id: asset || (currency && currency.id) || constants.ECHO_ASSET_ID,
		},
	};

	dispatch(setValue(form, 'isAvailableBalance', true));
	return dispatch(getTransactionFee(FORM_FREEZE, 'balance_freeze', options));
};

/**
 * @method getTransferFee
 *
 * @param {String} form
 * @param {String} asset
 * @returns {function(dispatch, getState): Promise<(Object | null)>}
 */
export const getTransferFee = (form, asset) => async (dispatch, getState) => {
	const formOptions = getState().form.get(form);

	if (!formOptions.get('to').value) {
		dispatch(setValue(form, 'isAvailableBalance', false));
		return null;
	}
	try {
		const toAccountId = (await echo.api.getAccountByName(formOptions.get('to').value)).id;
		const fromAccountId = getState().global.getIn(['activeUser', 'id']);
		let amountValue = 0;
		const amount = formOptions.get('amount').value;
		if (amount) {
			const currency = formOptions.get('currency');
			const amountError = validateAmount(amount, currency);
			if (!amountError) {
				amountValue = new BN(amount).times(new BN(10).pow(currency.precision)).toString(10);
			}
		}
		const options = {
			amount: {
				amount: amountValue,
				asset_id: asset || formOptions.get('currency').id,
			},
			from: fromAccountId,
			to: toAccountId,
			fee: {
				asset_id: asset || formOptions.get('currency').id,
			},
		};
		dispatch(setValue(form, 'isAvailableBalance', true));
		return dispatch(getTransactionFee(form, 'transfer', options));
	} catch (err) {
		return null;
	}

};

/**
 * @method checkFeePool
 *
 * @param {Object} echoAsset
 * @param {Object} asset
 * @param {String | Number} fee
 * @returns {Boolean}
 */
export const checkFeePool = (echoAsset, asset, fee) => {
	if (echoAsset.id === asset.id) { return true; }

	let feePool = new BN(asset.dynamic.fee_pool).div(10 ** echoAsset.precision);

	const { quote, base } = asset.options.core_exchange_rate;
	const precision = echoAsset.precision - asset.precision;
	const price = new BN(quote.amount).div(base.amount).times(10 ** precision);
	feePool = price.times(feePool).times(10 ** asset.precision);

	return feePool.gt(fee);
};

/**
 * @method setAssetsToForm
 *
 * @param {String} from
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setAssetsToForm = (from) => async (dispatch, getState) => {

	if (!getState().global.getIn(['activeUser', 'id'])) {
		return;
	}

	const balances = getState().balance.get('assets').toArray() || [];
	dispatch(setValue(from, 'balance', { assets: new List(balances) }));
};

/**
 * @method checkAccount
 *
 * @param {String} accountName
 * @param {String} subject
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const checkAccount = (accountName, subject) => async (dispatch, getState) => {
	try {
		if (!accountName) return false;

		const opositeSubject = subject === 'to' ? 'from' : 'to';

		const {
			value: opositeAccountName,
			error: opositeAccountError,
		} = getState().form.getIn([FORM_TRANSFER, opositeSubject]);

		const accountNameError = await validateAccountExist(accountName, true);

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
			const { id } = await echo.api.getAccountByName(accountName);
			const [account] = await echo.api.getFullAccounts([id]);
			const assets = account.balances;
			balances = await dispatch(getBalanceFromAssets(assets));
			([defaultAsset] = balances);
			dispatch(setIn(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
		}

		if (!defaultAsset) {
			defaultAsset = await echo.api.getObject(constants.ECHO_ASSET_ID);

			defaultAsset = {
				balance: 0,
				id: defaultAsset.id,
				symbol: defaultAsset.symbol,
				precision: defaultAsset.precision,
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

/**
 * @method transfer
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const transfer = () => async (dispatch, getState) => {
	const form = getState().form.get(FORM_TRANSFER).toJS();

	const {
		from,
		to,
		currency,
	} = form;

	let { fee } = form;
	const amount = new BN(form.amount.value).toString(10);

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

	const echoAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, '1.3.0']).toJS();
	const feeAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, fee.asset.id]).toJS();

	if (!checkFeePool(echoAsset, feeAsset, fee.value)) {
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
	const fromAccount = await echo.api.getAccountByName(from.value);
	const toAccount = await echo.api.getAccountByName(to.value);

	let options = {};

	if (currency.type === 'tokens') {
		const code = getMethod(
			{
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
			},
			[toAccount.id, new BN(amount).times(10 ** currency.precision).toString(10)],
		);

		options = {
			fee: { asset_id: '1.3.0', amount: fee.value },
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
				amount: new BN(amount).times(10 ** currency.precision).toString(10),
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

/**
 * @method freezeBalance
 *
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const freezeBalance = () => async (dispatch, getState) => {

	const form = getState().form.get(FORM_FREEZE).toJS();
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	const {
		currency,
		duration,
	} = form;

	const durationObject = FREEZE_BALANCE_PARAMS.find((d) => d.duration === duration.value);

	let { fee } = form;
	const amount = new BN(form.amount.value).toString();

	if (form.amount.error || fee.error || !activeUserId || !durationObject) {
		return false;
	}

	if ((new BN(amount)).eq(0)) {
		dispatch(setFormError(FORM_FREEZE, 'amount', 'Amount shouldn\'t be 0 value'));
		return false;
	}

	const amountError = validateAmount(amount, currency);
	if (amountError) {
		dispatch(setFormError(FORM_FREEZE, 'amount', amountError));
		return false;
	}


	if (!fee.value || !fee.asset) {
		fee = await dispatch(getTransferFee(FORM_FREEZE));
	}

	const echoAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, '1.3.0']).toJS();
	const feeAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, fee.asset.id]).toJS();

	if (!checkFeePool(echoAsset, feeAsset, fee.value)) {
		dispatch(setFormError(
			FORM_FREEZE,
			'fee',
			`${fee.asset.symbol} fee pool balance is less than fee amount`,
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_FREEZE, 'fee', 'Insufficient funds for fee'));
			return false;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_FREEZE, 'fee', 'Insufficient funds for fee'));
			return false;
		}
	}

	dispatch(toggleLoading(FORM_FREEZE, true));

	const options = {
		fee: {
			amount: fee.value,
			asset_id: fee.asset.id,
		},
		account: activeUserId,
		duration: duration.value,
		amount: {
			amount: new BN(amount).times(10 ** currency.precision).toString(),
			asset_id: currency.id,
		},
	};

	const precision = new BN(10).pow(fee.asset.precision);
	const showOptions = {
		amount: `${amount} ${currency.symbol}`,
		from: getState().global.getIn(['activeUser', 'name']),
		account: getState().global.getIn(['activeUser', 'name']),
		duration: durationObject.durationText,
		fee: `${new BN(fee.value).div(precision).toString(10)} ${fee.asset.symbol}`,
	};

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: 'balance_freeze',
		options,
		showOptions,
	}));

	return true;
};

/**
 * @method createContract
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
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
		options.fee.amount = fee.value;
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

/**
 * @method sendTransaction
 *
 * @param {*} password
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const sendTransaction = (password) => async (dispatch, getState) => {
	const { operation, options } = getState().transaction.toJS();
	const { value: operationId } = operations[operation];

	if (!echo.isConnected) {
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

	const tr = echo.createTransaction();
	tr.addOperation(operationId, options);

	try {
		const signer = options[operations[operation].signer];
		await signTransaction(signer, tr, password);
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
			dispatch(toggleModalLoading(MODAL_DETAILS, false));
		}).catch((error) => {
			const { message } = error;
			toastError(`${operations[operation].name} transaction wasn't completed. ${message}`);
			dispatch(setError(PERMISSION_TABLE, message));
			dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
			dispatch(toggleModalLoading(MODAL_DETAILS, false));
		});
	} catch (error) {
		toastError(`${operations[operation].name} transaction wasn't completed. ${error.message}`);
		dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
	}
	toastSuccess(`${operations[operation].name} transaction was sent`);
	if (operationId === operations.account_update.value) {
		dispatch(setValue(FORM_PERMISSION_KEY, 'isEditMode', false));
		history.push(PERMISSIONS_PATH);
	} else {
		history.push(bytecode ? CONTRACT_LIST_PATH : ACTIVITY_PATH);
	}

	dispatch(closeModal(MODAL_DETAILS));
	dispatch(resetTransaction());
};

/**
 * @method callContract
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
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
		fee: { asset_id: '1.3.0' },
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

	options.fee.amount = feeValue.value;
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

/**
 * @method callContractViaId
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
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

	const isValidContractId = validators.isContractId(id.value);

	if (!isValidContractId) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'id', 'Invalid contract ID'));
		return false;
	}

	dispatch(resetTransaction());

	const { amount, currency } = form;

	// if method payable check amount and currency

	if (!currency || !fee || !fee.value) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'amount', 'Fee can\'t be calculated'));
		return false;
	}

	if (!amount) {
		amount.value = 0;
	}

	const assets = getState().balance.get('assets').toArray();

	const feeError = validateFee(amount, currency, fee, assets);
	if (feeError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'amount', feeError));
		return false;
	}

	let amountValue = 0;

	if (amount.value) {
		const amountError = validateAmount(amount.value, currency);
		if (amountError) {
			dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'amount', amountError));
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

/**
 * @method setAssetActiveAccount
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setAssetActiveAccount = () => (dispatch, getState) => {
	const balances = getState().balance.get('assets');
	dispatch(setValue(FORM_TRANSFER, 'balance', { assets: new List((balances.toJS())) }));
};

/**
 * @method estimateFormFee
 *
 * @param {Object} asset
 * @param {String} form
 * @returns {function(dispatch, getState): Promise<(Number | null)>}
 */
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

		try {
			bytecode = getMethod(targetFunction, args);
		} catch (_) {
			dispatch(setFormError(FORM_CALL_CONTRACT, 'fee', 'Can\'t be calculated'));
		}

		if (!bytecode) {
			return null;
		}

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

		const amount = BN(formValues.amount.value).toString(10);

		bytecode = getMethod(
			{
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
			},
			['1.2.1', new BN(amount).times(10 ** currency.precision).toString(10)],
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

import BN from 'bignumber.js';
import { List } from 'immutable';

import { CACHE_MAPS, validators, constants } from 'echojs-lib';

import Services from '../services';

import history from '../history';

import operations from '../constants/Operations';
import {
	FORM_TRANSFER,
	FORM_CALL_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
	FORM_FREEZE,
	FORM_PERMISSION_KEY,
	FORM_CREATE_CONTRACT_OPTIONS,
	FORM_CREATE_CONTRACT_SOURCE_CODE,
	FORM_CREATE_CONTRACT_BYTECODE,
	FORM_SIGN_UP,
	FORM_REPLENISH,
	FORM_CHANGE_DELEGATE,
} from '../constants/FormConstants';

import { COMMITTEE_TABLE, PERMISSION_TABLE } from '../constants/TableConstants';
import {
	MODAL_BLACKLIST,
	MODAL_DETAILS,
	MODAL_REPLENISH,
	MODAL_TO_BLACKLIST,
	MODAL_TO_WHITELIST,
	MODAL_WHITELIST,
	MODAL_CHANGE_PARENT_ACCOUNT,
} from '../constants/ModalConstants';
import { CONTRACT_LIST_PATH, ACTIVITY_PATH, INDEX_PATH } from '../constants/RouterConstants';
import { ERROR_FORM_TRANSFER } from '../constants/FormErrorConstants';
import {
	CONTRACT_ID_PREFIX,
	ECHO_ASSET_ID,
	FREEZE_BALANCE_PARAMS,
	APPLY_CHANGES_TIMEOUT,
	ECHO_ASSET_PRECISION,
	ADDRESS_PREFIX,
	REGISTRATION,
} from '../constants/GlobalConstants';
import {
	ACCOUNT_ID_SUBJECT_TYPE,
	ACCOUNT_NAME_SUBJECT_TYPE,
	ADDRESS_SUBJECT_TYPE,
	CONTRACT_ID_SUBJECT_TYPE,
	WITHDRAW_SUBJECT_TYPE,
} from '../constants/TransferConstants';
import {
	SOURCE_CODE_MODE,
	SUPPORTED_ASSET_CUSTOM,
} from '../constants/ContractsConstants';

import { closeModal, toggleLoading as toggleModalLoading } from './ModalActions';
import {
	toggleLoading,
	setFormError,
	setValue,
	setIn,
	setInFormError,
} from './FormActions';
import { addContractByName, set as contractSet } from './ContractActions';
import { getBalanceFromAssets } from './BalanceActions';
import { setValue as setTableValue, setError } from './TableActions';
import { signTransaction } from './SignActions';

import { getMethod, trim0xFomCode } from '../helpers/ContractHelper';
import { toastSuccess, toastError } from '../helpers/ToastHelper';
import {
	validateCode,
	validateAbi,
	validateContractName,
	validateByType,
	validateAmount,
	validateFee,
	validateAccountAddress,
} from '../helpers/ValidateHelper';
import { formatError } from '../helpers/FormatHelper';

import { validateAccountExist } from '../api/WalletApi';
import { getOperationFee } from '../api/TransactionApi';
import TransactionReducer from '../reducers/TransactionReducer';
import GlobalReducer from '../reducers/GlobalReducer';
import { isBtcAddress, isEthAddress } from '../helpers/SidechainHelper';
import { STABLE_COINS } from '../constants/SidechainConstants';

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
		const feeAsset = await Services.getEcho().api.getObject(fee.asset_id);
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
 * @method setAdditionalAccountInfo
 *
 * @param {String} value
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const setAdditionalAccountInfo = (value) => async (dispatch, getState) => {
	dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
		prefix: '',
		value: '',
	}));
	if (!value) {
		return;
	}
	switch (getState().form.getIn([FORM_TRANSFER, 'subjectTransferType'])) {
		case ADDRESS_SUBJECT_TYPE: {
			const accountId = await Services.getEcho().api.getAccountByAddress(value.toLowerCase());
			if (!accountId) {
				dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
					prefix: '',
					value: '',
				}));
				return;
			}
			const account = await Services.getEcho().api.getObject(accountId);
			dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
				prefix: 'wallet_page.create_payment.additional_info_name',
				value: account.name,
			}));
			break;
		}
		case ACCOUNT_ID_SUBJECT_TYPE: {
			dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
				prefix: 'wallet_page.create_payment.additional_info_name',
				value,
			}));
			break;
		}
		case ACCOUNT_NAME_SUBJECT_TYPE: {
			try {
				const account = await Services.getEcho().api.getAccountByName(value);
				dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
					prefix: 'wallet_page.create_payment.additional_info_id',
					value: account.id,
				}));
			} catch (e) {
				dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
					prefix: '',
					value: '',
				}));
			}
			break;
		}
		default: dispatch(setValue(FORM_TRANSFER, 'additionalAccountInfo', {
			prefix: '',
			value: '',
		}));
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
 * @method getFreezeBalanceFee
 *
 * @param {String} form
 * @param {String} asset
 * @returns {function(dispatch, getState): Promise<(Object | null)>}
 */
export const getContractPoolBalanceFee = (form, asset) => async (dispatch, getState) => {
	const formOptions = getState().form.get(form);
	const contractId = getState().modal.getIn([MODAL_REPLENISH, 'contractId']);

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
		sender: activeUserId,
		contract: contractId,
		value: {
			amount: amountValue,
			asset_id: constants.ECHO_ASSET_ID,
		},
		fee: {
			asset_id: asset || (currency && currency.id) || constants.ECHO_ASSET_ID,
		},
	};

	dispatch(setValue(form, 'isAvailableBalance', true));
	return dispatch(getTransactionFee(FORM_REPLENISH, 'contract_fund_pool', options));
};

export const setTransferFee = (assetId) => async (dispatch, getState) => {
	const form = getState().form.get(FORM_TRANSFER);
	const activeUserId = getState()
		.global
		.getIn(['activeUser', 'id']);

	if (!activeUserId) return null;

	const to = form.get('to').value;
	const amount = form.get('amount').value;
	const bytecode = form.get('bytecode').value;
	const currency = form.get('currency');

	let amountValue = 0;
	if (+amount) {
		const amountError = validateAmount(amount, currency);
		if (!amountError) {
			amountValue = new BN(amount).times(new BN(10).pow(currency.precision))
				.toString(10);
		} else {
			dispatch(setFormError(FORM_TRANSFER, 'amount', amountError));
			return false;
		}
	}

	if (!currency || !currency.precision) return null;

	const echoAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
	switch (form.get('subjectTransferType')) {
		case CONTRACT_ID_SUBJECT_TYPE: {
			let bytecodeValue = '';
			if (bytecode) {
				bytecodeValue = trim0xFomCode(bytecode);
				const bytecodeError = validateCode(bytecode, true);

				if (bytecodeError) {
					dispatch(setFormError(FORM_TRANSFER, 'bytecode', bytecodeError));
					return false;
				}
			}
			try {
				const options = {
					fee: {
						asset_id: assetId || form.getIn(['fee', 'asset', 'id']) || ECHO_ASSET_ID,
						amount: 0,
					},
					registrar: activeUserId,
					value: {
						amount: amountValue || 0,
						asset_id: currency.id || ECHO_ASSET_ID,
					},
					code: bytecodeValue,
					callee: to,
				};

				const fee = await dispatch(getTransactionFee(FORM_TRANSFER, 'contract_call', options));

				return {
					value: fee ? fee.value : '',
					asset: echoAsset,
				};

			} catch (error) {
				return null;
			}
		}
		case ADDRESS_SUBJECT_TYPE: {
			try {
				const fromAccount = await Services.getEcho().api.getAccountByName(form.get('from').value);
				const options = {
					fee: {
						asset_id: assetId || form.getIn(['fee', 'asset', 'id']) || ECHO_ASSET_ID,
						amount: 0,
					},
					from: fromAccount.id,
					to,
					amount: {
						amount: amountValue || 0,
						asset_id: currency.id || ECHO_ASSET_ID,
					},
				};

				const fee = await dispatch(getTransactionFee(FORM_TRANSFER, 'transfer_to_address', options));

				return {
					value: fee ? fee.value : '',
					asset: echoAsset,
				};

			} catch (error) {
				return null;
			}
		}
		case WITHDRAW_SUBJECT_TYPE: {
			try {
				const activeCoinTypeTab = getState().global.get('activeCoinTypeTab');
				const fromAccount = await Services.getEcho().api.getAccountByName(form.get('from').value);
				const options = {
					fee: {
						asset_id: assetId || form.getIn(['fee', 'asset', 'id']) || ECHO_ASSET_ID,
						amount: 0,
					},
					account: fromAccount.id,
					value: amountValue || 0,
				};

				let operationType = '';
				if (activeCoinTypeTab === STABLE_COINS.EBTC) {
					options.btc_addr = to;
					operationType = 'sidechain_btc_withdraw';
				} else {
					options.eth_addr = to.replace('0x', '');
					operationType = 'sidechain_eth_withdraw';
				}

				const fee = await dispatch(getTransactionFee(FORM_TRANSFER, operationType, options));

				return {
					value: fee ? fee.value : '',
					asset: echoAsset,
				};

			} catch (error) {
				return null;
			}
		}
		default:
			return null;
	}
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

	const subjectTransferType = formOptions.get('subjectTransferType');

	if (
		subjectTransferType &&
		![ACCOUNT_ID_SUBJECT_TYPE, ACCOUNT_NAME_SUBJECT_TYPE].includes(subjectTransferType)
	) {
		const fee = await dispatch(setTransferFee(asset));

		dispatch(setValue(form, 'isAvailableBalance', true));

		return fee;
	}

	try {
		const to = formOptions.get('to').value;
		const toAccountId = validators.isAccountId(to)
			? to
			: (await Services.getEcho().api.getAccountByName(to)).id;
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
			const { id } = await Services.getEcho().api.getAccountByName(accountName);
			const [account] = await Services.getEcho().api.getFullAccounts([id]);
			const assets = account.balances;
			balances = await dispatch(getBalanceFromAssets(assets));
			([defaultAsset] = balances);
			dispatch(setIn(FORM_TRANSFER, 'balance', { assets: new List(balances) }));
		}

		if (!defaultAsset) {
			defaultAsset = await Services.getEcho().api.getObject(constants.ECHO_ASSET_ID);

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

export const subjectToSendSwitch = (value) => async (dispatch, getState) => {
	const activeCoinTypeTab = getState().global.get('activeCoinTypeTab');

	if (activeCoinTypeTab) {
		if (!value) {
			dispatch(setIn(FORM_TRANSFER, 'to', { loading: false }));
			return false;
		}

		switch (activeCoinTypeTab) {
			case STABLE_COINS.EETH: {
				if (!value.startsWith('0x')) {
					dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.sidechain_errors.incorrect_beginning_of_eth_address'));
					return false;
				}

				if (!isEthAddress(value)) {
					dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.sidechain_errors.invalid_eth_address'));
					return false;
				}
				break;
			}
			case STABLE_COINS.EBTC: {
				if (!isBtcAddress(value)) {
					dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.sidechain_errors.invalid_btc_address'));
					return false;
				}
				break;
			}
			default: {
				dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.sidechain_errors.unexpected_error'));
				return false;
			}
		}

		dispatch(setValue(FORM_TRANSFER, 'subjectTransferType', WITHDRAW_SUBJECT_TYPE));
		dispatch(setIn(FORM_TRANSFER, 'to', {
			checked: true,
			error: null,
		}));
		dispatch(setValue(FORM_TRANSFER, 'avatarName', ''));
		await dispatch(setAdditionalAccountInfo(''));
		return WITHDRAW_SUBJECT_TYPE;
	}

	if (validateAccountAddress(value)) {
		dispatch(setValue(FORM_TRANSFER, 'subjectTransferType', ADDRESS_SUBJECT_TYPE));
		dispatch(setIn(FORM_TRANSFER, 'to', {
			checked: true,
			error: null,
		}));
		dispatch(setValue(FORM_TRANSFER, 'avatarName', ''));

		await dispatch(setAdditionalAccountInfo(value));
		return ADDRESS_SUBJECT_TYPE;

	} else if (validators.isContractId(value)) {

		const contract = await Services.getEcho().api.getContract(value);
		if (!contract) {
			dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.contract_errors.invalid_id_error'));
			return false;
		}

		dispatch(setValue(FORM_TRANSFER, 'subjectTransferType', CONTRACT_ID_SUBJECT_TYPE));
		dispatch(setIn(FORM_TRANSFER, 'to', {
			checked: true,
			error: null,
		}));

		dispatch(setValue(FORM_TRANSFER, 'avatarName', ''));

		await dispatch(setAdditionalAccountInfo(''));
		return CONTRACT_ID_SUBJECT_TYPE;

	} else if (validators.isAccountId(value)) {

		const account = await Services.getEcho().api.getObject(value);
		if (!account) {
			dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.account_errors.invalid_id_error'));
			return false;
		}
		value = account.name;
		dispatch(setValue(FORM_TRANSFER, 'subjectTransferType', ACCOUNT_ID_SUBJECT_TYPE));
		await dispatch(setAdditionalAccountInfo(value));
	} else {
		dispatch(setValue(FORM_TRANSFER, 'subjectTransferType', ACCOUNT_NAME_SUBJECT_TYPE));
		await dispatch(setAdditionalAccountInfo(value));
	}

	dispatch(setValue(FORM_TRANSFER, 'avatarName', value));
	return dispatch(checkAccount(value, 'to'));
};

/**
 * @method transfer
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const transfer = (form) => async (dispatch, getState) => {

	const {
		from,
		to,
		currency,
	} = form;

	let { fee } = form;
	const amount = new BN(form.amount.value).toString(10);

	if (!to.value) {
		dispatch(setFormError(FORM_TRANSFER, 'to', 'errors.account_errors.empty_account_error'));
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
			'errors.fee_errors.pool_balance_less_amount_error',
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	}

	dispatch(toggleLoading(FORM_TRANSFER, true));
	const fromAccount = await Services.getEcho().api.getAccountByName(from.value);
	const toAccount = validators.isAccountId(to.value)
		? await Services.getEcho().api.getObject(to.value)
		: await Services.getEcho().api.getAccountByName(to.value);

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

export const transferSwitch = () => async (dispatch, getState) => {
	const form = getState().form.get(FORM_TRANSFER).toJS();

	const {
		from,
		to,
		currency,
	} = form;
	if (form.subjectTransferType === ADDRESS_SUBJECT_TYPE && validators.isContractId(currency.id)) {
		form.to.value = await Services.getEcho().api.getAccountByAddress(to.value.toLowerCase());
		return dispatch(transfer(form));
	}

	let { fee } = form;
	const amount = new BN(form.amount.value).toString(10);

	if (to.error || from.error || form.amount.error || fee.error) {
		return false;
	}

	if (!from.value) {
		dispatch(setFormError(FORM_TRANSFER, 'from', 'errors.account_errors.empty_account_error'));
		return false;
	}

	if (!to.value) {
		dispatch(setFormError(
			FORM_TRANSFER,
			'to',
			form.subjectTransferType === ADDRESS_SUBJECT_TYPE ?
				'errors.address_errors.empty_address_error' :
				'errors.contract_errors.empty_id_error',
		));
		return false;
	}

	const amountError = validateAmount(amount, currency);

	if (amountError) {
		dispatch(setFormError(FORM_TRANSFER, 'amount', amountError));
		return false;
	}

	if (!fee.value || !fee.asset) {
		fee = await dispatch(setTransferFee());
	}

	const echoAsset = getState()
		.echojs
		.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, '1.3.0'])
		.toJS();
	const feeAsset = getState()
		.echojs
		.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, fee.asset.id])
		.toJS();

	if (!checkFeePool(echoAsset, feeAsset, fee.value)) {
		dispatch(setFormError(
			FORM_TRANSFER,
			'fee',
			'errors.fee_errors.pool_balance_less_amount_error',
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision)
			.plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	} else {
		const asset = getState()
			.balance
			.get('assets')
			.toArray()
			.find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_TRANSFER, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	}

	dispatch(toggleLoading(FORM_TRANSFER, true));
	const fromAccount = await Services.getEcho().api.getAccountByName(from.value);

	switch (form.subjectTransferType) {
		case ADDRESS_SUBJECT_TYPE: {
			const options = {
				fee: {
					asset_id: form.fee.asset ? form.fee.asset.id : ECHO_ASSET_ID,
					amount: fee.value || 0,
				},
				from: fromAccount.id,
				to: to.value.toLowerCase(),
				amount: {
					amount: new BN(amount).times(10 ** currency.precision).toString(10) || 0,
					asset_id: currency.id || ECHO_ASSET_ID,
				},
			};

			const precision = new BN(10).pow(fee.asset.precision);
			const showOptions = {
				fee: `${new BN(fee.value).div(precision)
					.toString(10)} ${fee.asset.symbol}`,
				from: fromAccount.name,
				to_address: to.value,
				amount: `${amount} ${currency.symbol}`,
			};

			dispatch(resetTransaction());

			dispatch(TransactionReducer.actions.setOperation({
				operation: 'transfer_to_address',
				options,
				showOptions,
			}));

			return true;
		}
		case CONTRACT_ID_SUBJECT_TYPE: {
			let bytecodeValue = '';
			if (form.bytecode.value) {
				bytecodeValue = trim0xFomCode(form.bytecode.value);
				const bytecodeError = validateCode(form.bytecode.value, true);

				if (bytecodeError) {
					dispatch(setFormError(FORM_TRANSFER, 'bytecode', bytecodeError));
					return false;
				}
			}

			const options = {
				fee: {
					asset_id: form.fee.asset ? form.fee.asset.id : ECHO_ASSET_ID,
					amount: fee.value || 0,
				},
				registrar: fromAccount.id,
				value: {
					amount: new BN(amount).times(10 ** currency.precision).toString(10) || 0,
					asset_id: currency.id || ECHO_ASSET_ID,
				},
				code: bytecodeValue,
				callee: to.value,
			};

			const precision = new BN(10).pow(fee.asset.precision);
			const showOptions = {
				fee: `${new BN(fee.value).div(precision)
					.toString(10)} ${fee.asset.symbol}`,
				from: fromAccount.name,
				to_contract: to.value,
				amount: `${amount} ${currency.symbol}`,
			};

			dispatch(resetTransaction());

			dispatch(TransactionReducer.actions.setOperation({
				operation: 'contract_call',
				options,
				showOptions,
			}));

			return true;
		}
		case WITHDRAW_SUBJECT_TYPE: {
			const activeCoinTypeTab = getState().global.get('activeCoinTypeTab');
			const options = {
				fee: {
					asset_id: form.fee.asset ? form.fee.asset.id : ECHO_ASSET_ID,
					amount: fee.value || 0,
				},
				account: fromAccount.id,
				value: new BN(amount).times(10 ** currency.precision).toString(10) || 0,
				to: to.value.toLowerCase(),
			};

			const precision = new BN(10).pow(fee.asset.precision);
			const showOptions = {
				fee: `${new BN(fee.value).div(precision)
					.toString(10) || 0} ${fee.asset.symbol}`,
				account: fromAccount.name,
				value: `${amount} ${currency.symbol}`,
			};

			let operationType = '';
			if (activeCoinTypeTab === STABLE_COINS.EBTC) {
				options.btc_addr = to.value;
				showOptions.btc_address = to.value;
				operationType = 'sidechain_btc_withdraw';
			} else {
				options.eth_addr = to.value.replace('0x', '');
				showOptions.eth_address = to.value;
				operationType = 'sidechain_eth_withdraw';
			}

			dispatch(resetTransaction());

			dispatch(TransactionReducer.actions.setOperation({
				operation: operationType,
				options,
				showOptions,
			}));

			return true;
		}
		case ACCOUNT_ID_SUBJECT_TYPE:
		case ACCOUNT_NAME_SUBJECT_TYPE:
			return dispatch(transfer(form));
		default:
	}

	return null;
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
		dispatch(setFormError(FORM_FREEZE, 'amount', 'errors.amount_errors.zero_amount_error_v2'));
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
			'errors.fee_errors.pool_balance_less_amount_error',
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_FREEZE, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_FREEZE, 'fee', 'errors.fee_errors.insufficient_funds'));
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
 * @method replenishContractPool
 *
 * @returns {function(dispatch, getState): Promise<Boolean>}
 */
export const replenishContractPool = () => async (dispatch, getState) => {

	const form = getState().form.get(FORM_REPLENISH).toJS();
	const contractId = getState().modal.getIn([MODAL_REPLENISH, 'contractId']);
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	const {
		currency,
	} = form;

	let { fee } = form;
	const amount = new BN(form.amount.value).toString();

	if (form.amount.error || fee.error || !activeUserId) {
		return false;
	}

	if ((new BN(amount)).eq(0)) {
		dispatch(setFormError(FORM_REPLENISH, 'amount', 'errors.amount_errors.zero_amount_error_v2'));
		return false;
	}

	const amountError = validateAmount(amount, currency);
	if (amountError) {
		dispatch(setFormError(FORM_REPLENISH, 'amount', amountError));
		return false;
	}


	if (!fee.value || !fee.asset) {
		fee = await dispatch(getTransferFee(FORM_REPLENISH));
	}

	const echoAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, ECHO_ASSET_ID]).toJS();
	const feeAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, fee.asset.id]).toJS();

	if (!checkFeePool(echoAsset, feeAsset, fee.value)) {
		dispatch(setFormError(
			FORM_REPLENISH,
			'fee',
			'errors.fee_errors.pool_balance_less_amount_error',
		));
		return false;
	}

	if (currency.id === fee.asset.id) {
		const total = new BN(amount).times(10 ** currency.precision).plus(fee.value);

		if (total.gt(currency.balance)) {
			dispatch(setFormError(FORM_REPLENISH, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	} else {
		const asset = getState().balance.get('assets').toArray().find((i) => i.id === fee.asset.id);
		if (new BN(fee.value).gt(asset.balance)) {
			dispatch(setFormError(FORM_REPLENISH, 'fee', 'errors.fee_errors.insufficient_funds'));
			return false;
		}
	}

	dispatch(toggleLoading(FORM_REPLENISH, true));

	const options = {
		fee: {
			amount: fee.value,
			asset_id: fee.asset.id,
		},
		sender: activeUserId,
		contract: contractId,
		value: {
			amount: new BN(amount).times(10 ** currency.precision).toString(),
			asset_id: currency.id,
		},
	};

	const precision = new BN(10).pow(fee.asset.precision);
	const showOptions = {
		value: `${amount} ${currency.symbol}`,
		sender: getState().global.getIn(['activeUser', 'name']),
		contract: contractId,
		fee: `${new BN(fee.value).div(precision).toString(10)} ${fee.asset.symbol}`,
	};

	dispatch(resetTransaction());

	dispatch(TransactionReducer.actions.setOperation({
		operation: 'contract_fund_pool',
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
	const mode = getState().form.getIn([FORM_CREATE_CONTRACT_OPTIONS, 'contractMode']);
	const formName = mode === SOURCE_CODE_MODE
		? FORM_CREATE_CONTRACT_SOURCE_CODE
		: FORM_CREATE_CONTRACT_BYTECODE;
	const form = getState().form.get(formName);

	const {
		bytecode, name, abi, code,
	} = form.toJS();
	const {
		supportedAsset, ETHAccuracy, currency, amount, supportedAssetRadio,
	} = getState().form.get(FORM_CREATE_CONTRACT_OPTIONS).toJS();

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);
	if (!activeUserId || !activeUserName) {
		return false;
	}

	const bytecodeValue = trim0xFomCode(bytecode.value);

	const error = validateCode(bytecodeValue);

	if (error) {
		dispatch(setFormError(formName, code ? 'code' : 'bytecode', error));
		return false;
	}

	if (getState().form.getIn([formName, code ? 'code' : 'abi']).value) {
		const nameError = validateContractName(name.value);
		const abiError = validateAbi(abi.value);

		if (nameError) {
			dispatch(setFormError(formName, 'name', nameError));
			return false;
		}

		if (abiError) {
			dispatch(setFormError(formName, code ? 'code' : 'abi', abiError));
			return false;
		}
	}

	try {
		if (supportedAssetRadio === SUPPORTED_ASSET_CUSTOM && !supportedAsset.value) {
			dispatch(setFormError(FORM_CREATE_CONTRACT_OPTIONS, 'supportedAsset', 'errors.contract_errors.asset_not_selected_error'));
			return false;
		}

		let supportedAssetId = '';
		if (supportedAsset.value) {
			const assets = await Services.getEcho().api.lookupAssetSymbols([supportedAsset.value]);
			const asset = assets.find((a) => a.symbol === supportedAsset.value);
			supportedAssetId = asset.id;
		}

		dispatch(resetTransaction());

		const precision = new BN(10).pow((currency && currency.precision)
			? currency.precision
			: ECHO_ASSET_PRECISION);

		const options = {
			registrar: activeUserId,
			value: {
				amount: amount.value ? new BN(amount.value).times(precision).toString(10) : 0,
				asset_id: currency.id || ECHO_ASSET_ID,
			},
			fee: { amount: 0, asset_id: supportedAssetId || ECHO_ASSET_ID },
			code: bytecodeValue,
			eth_accuracy: ETHAccuracy,
		};

		if (supportedAssetId) {
			options.supported_asset_id = supportedAssetId;
			if (new BN(options.value.amount).eq(0)) {
				options.value.asset_id = supportedAssetId;
			} else if (options.value.asset_id !== supportedAssetId) {
				dispatch(setFormError(
					FORM_CREATE_CONTRACT_OPTIONS,
					'amount',
					'errors.contract_errors.assets_not_equal_error',
				));
				return null;
			}
		}

		const fee = await dispatch(getTransactionFee(FORM_CREATE_CONTRACT_OPTIONS, 'contract_create', options));

		if (fee) {
			dispatch(setValue(FORM_CREATE_CONTRACT_OPTIONS, 'fee', fee));
		} else {
			if (abi.value) {
				const handledAbi = JSON.parse(abi.value);
				const isConstructorExistAndPayable = handledAbi
					.find(({ type, payable }) => type === 'constructor' && payable);
				if (!isConstructorExistAndPayable && !new BN(options.value.amount).eq(0)) {
					dispatch(setFormError(FORM_CREATE_CONTRACT_OPTIONS, 'amount', 'errors.contract_errors.fee_in_not_payable_error'));
					return null;
				}
			}

			dispatch(setFormError(FORM_CREATE_CONTRACT_OPTIONS, 'amount', 'errors.contract_errors.cant_calculate_fee'));
			return null;
		}
		options.fee.amount = fee.value;
		const showOptions = {
			from: activeUserName,
			fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
			code: bytecodeValue,
			eth_accuracy: ETHAccuracy ? 'On' : 'Off',
			supported_asset: supportedAsset.value || 'All',
		};

		if (amount.value && amount.value !== '0') {
			showOptions.amount = `${amount.value} ${(currency && currency.symbol) ? currency.symbol : ADDRESS_PREFIX}`;
		}

		dispatch(TransactionReducer.actions.setOperation({ operation: 'contract_create', options, showOptions }));

		return true;
	} catch (err) {
		dispatch(setFormError(formName, code ? 'code' : 'bytecode', 'errors.transaction_errors.invalid_params_error'));
		return false;
	}
};

/**
 * @method sendTransaction
 *
 * @param {*} password
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const sendTransaction = (password, onSuccess = () => { }) => async (dispatch, getState) => {
	const { operation, options } = getState().transaction.toJS();
	const { value: operationId } = operations[operation];

	if (!Services.getEcho().isConnected) {
		toastError([{
			text: '',
			postfix: `operations.${operation}`,
		}, {
			text: '',
			postfix: 'toasts.errors.trx_dont_comp_by_lose_connection',
		}]);
		dispatch(closeModal(MODAL_DETAILS));
		return;
	}

	let permissionTableLoaderTimer;
	if (operationId === constants.OPERATIONS_IDS.ACCOUNT_UPDATE) {
		permissionTableLoaderTimer = setTimeout(() => dispatch(GlobalReducer.actions.set({ field: 'permissionLoading', value: false })), APPLY_CHANGES_TIMEOUT);
	}
	dispatch(toggleModalLoading(MODAL_DETAILS, true));
	dispatch(contractSet('loading', true));
	const accountId = getState().global.getIn(['activeUser', 'id']);
	const contractMode = getState().form.getIn([FORM_CREATE_CONTRACT_OPTIONS, 'contractMode']);
	const formName = contractMode === SOURCE_CODE_MODE
		? FORM_CREATE_CONTRACT_SOURCE_CODE
		: FORM_CREATE_CONTRACT_BYTECODE;
	const name = getState().form.getIn([formName, 'name']).value;
	const abi = getState().form.getIn([formName, 'abi']).value;
	const bytecode =
		getState().form.getIn([formName, 'bytecode']).value ||
		getState().form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'bytecode']).value;


	try {
		const tr = Services.getEcho().api.createTransaction();
		tr.addOperation(operationId, options);
		const signer = options[operations[operation].signer];
		await signTransaction(signer, tr, password);

		tr.broadcast().then((res) => {
			if (abi) {
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

			clearTimeout(permissionTableLoaderTimer);
			dispatch(toggleLoading(FORM_SIGN_UP, false));
			dispatch(GlobalReducer.actions.set({ field: 'permissionLoading', value: false }));
			toastSuccess([{
				text: '',
				postfix: `operations.${operation}`,
			}, {
				text: '',
				postfix: 'toasts.success.trx_complete_postfix',
			}]);
			dispatch(contractSet('loading', false));
			dispatch(toggleModalLoading(MODAL_DETAILS, false));
			onSuccess();
		}).catch((error) => {
			dispatch(toggleLoading(FORM_SIGN_UP, false));
			clearTimeout(permissionTableLoaderTimer);
			dispatch(GlobalReducer.actions.set({ field: 'permissionLoading', value: false }));
			const { message } = error;
			toastError([{
				text: '',
				postfix: `operations.${operation}`,
			}, {
				text: '',
				postfix: 'toasts.errors.trx_dont_complete_postfix',
			}, {
				text: '',
				postfix: error.message,
			}]);
			dispatch(contractSet('loading', false));
			dispatch(setError(PERMISSION_TABLE, message));
			dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
			dispatch(toggleModalLoading(MODAL_DETAILS, false));
		});
	} catch (error) {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
		toastError([{
			text: '',
			postfix: `operations.${operation}`,
		}, {
			text: '',
			postfix: 'toasts.errors.trx_dont_complete_postfix',
		}, {
			text: error.message,
			postfix: '',
		}]);
		dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', false));
	}
	toastSuccess([{
		text: '',
		postfix: `operations.${operation}`,
	}, {
		text: '',
		postfix: 'toasts.success.trx_sent_postfix',
	}]);

	switch (operationId) {
		case operations.account_update.value:
			dispatch(setValue(FORM_PERMISSION_KEY, 'isEditMode', false));
			break;
		case operations.balance_freeze.value:
		case operations.account_create.value:
			break;
		case operations.contract_fund_pool.value:
			dispatch(closeModal(MODAL_REPLENISH));
			break;
		case operations.contract_whitelist.value:
			dispatch(closeModal(MODAL_WHITELIST));
			dispatch(closeModal(MODAL_BLACKLIST));
			dispatch(closeModal(MODAL_TO_WHITELIST));
			dispatch(closeModal(MODAL_TO_BLACKLIST));
			break;
		case operations.sidechain_btc_create_address.value:
		case operations.sidechain_eth_create_address.value:
		case operations.account_address_create.value:
			history.push(INDEX_PATH);
			break;
		default:
			history.push(bytecode ? CONTRACT_LIST_PATH : ACTIVITY_PATH);
	}

	dispatch(closeModal(MODAL_DETAILS));
	dispatch(closeModal(MODAL_CHANGE_PARENT_ACCOUNT));
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
		dispatch(setFormError(FORM_CALL_CONTRACT, 'fee', 'errors.contract_errors.cant_calculate_fee'));
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

	const bytecodeValue = trim0xFomCode(bytecode.value);
	const bytecodeError = validateCode(bytecode.value, true);

	if (bytecodeError) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'bytecode', bytecodeError));
		return false;
	}

	const isValidContractId = validators.isContractId(id.value);

	if (!isValidContractId) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'id', 'errors.contract_errors.invalid_id_error'));
		return false;
	}
	dispatch(resetTransaction());

	const { amount, currency } = form;

	// if method payable check amount and currency

	if (!currency || !fee || !fee.value) {
		dispatch(setFormError(FORM_CALL_CONTRACT_VIA_ID, 'amount', 'errors.amount_errors.cant_calculate_fee_error'));
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
		code: bytecodeValue,
		callee: id.value,
	};

	const showOptions = {
		from: activeUserName,
		fee: `${fee.value / (10 ** fee.asset.precision)} ${fee.asset.symbol}`,
		code: bytecodeValue,
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
			dispatch(setFormError(FORM_CALL_CONTRACT, 'fee', 'errors.fee_errors.cant_calculate_error'));
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

export const generateBtcAddress = (address) => async (dispatch, getState) => {
	try {

		const activeUserId = getState().global.getIn(['activeUser', 'id']);

		const feeAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);

		const operation = 'sidechain_btc_create_address';

		const options = {
			fee: {
				asset_id: feeAsset.id,
			},
			account: activeUserId,
			backup_address: address,
		};

		options.fee.amount = await getOperationFee(operation, options);

		const precision = new BN(10).pow(feeAsset.precision);

		const showOptions = {
			from: getState().global.getIn(['activeUser', 'name']),
			account: getState().global.getIn(['activeUser', 'name']),
			backup_address: address,
			fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
		};
		dispatch(TransactionReducer.actions.setOperation({
			operation,
			options,
			showOptions,
		}));

		return true;
	} catch (error) {
		return null;
	}
};

export const generateEthAddress = () => async (dispatch, getState) => {
	try {
		const activeUserId = getState().global.getIn(['activeUser', 'id']);

		const feeAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);

		const options = {
			fee: {
				asset_id: feeAsset.id,
			},
			account: activeUserId,
		};

		const operation = 'sidechain_eth_create_address';

		options.fee.amount = await getOperationFee(operation, options);

		const precision = new BN(10).pow(feeAsset.precision);

		const showOptions = {
			from: getState().global.getIn(['activeUser', 'name']),
			account: getState().global.getIn(['activeUser', 'name']),
			fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
		};

		dispatch(TransactionReducer.actions.setOperation({
			operation,
			options,
			showOptions,
		}));

		return true;
	} catch (error) {
		return null;
	}
};

export const generateEchoAddress = (label) => async (dispatch, getState) => {
	try {
		const activeUserId = getState().global.getIn(['activeUser', 'id']);

		const feeAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);

		const options = {
			fee: {
				asset_id: feeAsset.id,
			},
			owner: activeUserId,
			label,
		};

		const operation = 'account_address_create';
		options.fee.amount = await getOperationFee(operation, options);

		const precision = new BN(10).pow(feeAsset.precision);

		const showOptions = {
			from: getState().global.getIn(['activeUser', 'name']),
			account: getState().global.getIn(['activeUser', 'name']),
			fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
			address_name: label,
		};

		dispatch(TransactionReducer.actions.setOperation({
			operation,
			options,
			showOptions,
		}));

		return true;
	} catch (error) {
		return null;
	}
};

/**
 * @method changeDelegate
 * @param {String} delegateId
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const changeDelegate = (delegateId) => async (dispatch, getState) => {
	try {
		dispatch(setFormError(FORM_CHANGE_DELEGATE, 'delegate', null));

		const activeUserId = getState().global.getIn(['activeUser', 'id']);

		const [delegate] = await Services.getEcho().api.getFullAccounts([delegateId]);

		const [
			feeAsset,
			activeUser,
		] = await Services.getEcho().api.getObjects([ECHO_ASSET_ID, activeUserId]);

		if (!delegate) {
			dispatch(setFormError(FORM_CHANGE_DELEGATE, 'delegate', 'errors.account_errors.delegate_not_found_error'));
			return null;
		}

		const {
			delegate_share: delegateShare,
			delegating_account: currentDelegate,
		} = activeUser.options;

		if (currentDelegate === delegateId) {
			dispatch(setFormError(FORM_CHANGE_DELEGATE, 'delegate', 'errors.account_errors.already_delegate_error'));
			return null;
		}

		const options = {
			fee: {
				asset_id: feeAsset.id,
			},
			account: activeUserId,
			new_options: {
				delegating_account: delegateId,
				delegate_share: delegateShare,
			},
		};

		const operation = 'account_update';
		options.fee.amount = await getOperationFee(operation, options);

		const precision = new BN(10).pow(feeAsset.precision);

		const showOptions = {
			from: getState().global.getIn(['activeUser', 'name']),
			delegate: delegate.name,
			fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
		};

		dispatch(TransactionReducer.actions.setOperation({
			operation,
			options,
			showOptions,
		}));

		return true;
	} catch (error) {
		return null;
	}
};

/**
 * @method createAccount
 * @param {String} fromAccount
 * @param {Object} param1
 * @returns {function(dispatch, getState): Promise<undefined>}
 */
export const createAccountTransaction = (fromAccount, { name, publicKey }) => async (dispatch) => {
	try {
		const sender = await Services.getEcho().api.getAccountByName(fromAccount);

		if (!sender) {
			return null;
		}

		const { id: senderId } = sender;

		const feeAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
		const options = {
			fee: {
				asset_id: feeAsset.id,
			},
			registrar: senderId,
			echorand_key: publicKey,
			active: {
				weight_threshold: REGISTRATION.DEFAULT_THRESHOLD,
				account_auths: [],
				key_auths: [[publicKey, REGISTRATION.DEFAULT_KEY_WEIGHT]],
			},
			name,
			options: {
				delegating_account: senderId,
				delegate_share: REGISTRATION.DEFAULT_DELEGATE_SHARE,
			},
		};

		const operation = 'account_create';
		options.fee.amount = await getOperationFee(operation, options);

		const precision = new BN(10).pow(feeAsset.precision);

		const showOptions = {
			from: sender.name,
			account: name,
			key: publicKey,
			fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
		};

		dispatch(TransactionReducer.actions.setOperation({
			operation,
			options,
			showOptions,
		}));

		return true;
	} catch (error) {
		dispatch(toggleLoading(FORM_SIGN_UP, false));
		return null;
	}
};

export const contractChangeWhiteAndBlackLists
	= (accountId, type, form, formField) => async (dispatch, getState) => {

		if (!accountId) {
			dispatch(setFormError(form, formField, 'errors.account_errors.empty_account_error_v2'));
			return null;
		}

		if (!validators.isAccountId(accountId)) {
			const account = await Services.getEcho().api.getAccountByName(accountId);
			if (!account) {
				dispatch(setFormError(form, formField, 'errors.account_errors.account_not_found_error'));
				return null;
			}
			accountId = account.id;
		}

		if ([MODAL_TO_WHITELIST, MODAL_TO_BLACKLIST].includes(type)) {
			const contracts = getState().echojs.get(CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID);
			const contractId = getState().contract.get('id');
			if (!contracts.get(contractId)) {
				dispatch(setFormError(form, formField, 'Network error'));
				return null;
			}
			const list = contracts.getIn([contractId, type === MODAL_TO_WHITELIST ? 'whitelist' : 'blacklist']);
			if (list && list.some((el) => el === accountId)) {
				dispatch(setFormError(form, formField, 'errors.address_errors.address_already_exists_error'));
				return null;
			}
		}

		const op = {
			add_to_whitelist: [],
			add_to_blacklist: [],
			remove_from_whitelist: [],
			remove_from_blacklist: [],
		};
		switch (type) {
			case MODAL_TO_WHITELIST:
				op.add_to_whitelist = [accountId];
				break;
			case MODAL_TO_BLACKLIST:
				op.add_to_blacklist = [accountId];
				break;
			case MODAL_WHITELIST:
				op.remove_from_whitelist = [accountId];
				break;
			case MODAL_BLACKLIST:
				op.remove_from_blacklist = [accountId];
				break;
			default: {
				return null;
			}
		}
		const operation = 'contract_whitelist';
		const activeUserId = getState().global.getIn(['activeUser', 'id']);
		const constractId = getState().contract.get('id');
		try {
			const feeAsset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
			const options = {
				fee: {
					asset_id: feeAsset.id,
				},
				sender: activeUserId,
				contract: constractId,
				...op,
			};

			options.fee.amount = await getOperationFee(operation, options);
			const precision = new BN(10).pow(feeAsset.precision);

			const showOptions = {
				sender: getState().global.getIn(['activeUser', 'name']),
				contract: constractId,
				fee: `${new BN(options.fee.amount).div(precision).toString(10)} ${feeAsset.symbol}`,
			};
			dispatch(TransactionReducer.actions.setOperation({
				operation,
				options,
				showOptions,
			}));
			return true;
		} catch (err) {
			dispatch(setFormError(form, formField, formatError(err)));
			return null;
		}
	};

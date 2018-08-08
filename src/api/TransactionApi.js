import { TransactionBuilder, TransactionHelper, Aes, PrivateKey, ops } from 'echojs-lib';
import ToastActions from '../actions/ToastActions';
import ToastSuccess from '../components/Toast/ToastSuccess';
import ToastError from '../components/Toast/ToastError';
import { addContractByName } from '../actions/ContractActions';
import { FORM_CREATE_CONTRACT } from '../constants/FormConstants';

export const buildAndSendTransaction = (operation, options, privateKey) => async (dispatch, getState) => {
	const tr = new TransactionBuilder();
	tr.add_type_operation(operation, options);

	await tr.set_required_fees();
	tr.add_signer(privateKey);

	try {
		await tr.broadcast();

		if (getState().form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList'])) {
			dispatch(addContractByName());
		}

		ToastActions.toastSuccess(ToastSuccess);
	} catch (err) {
		console.log(err);
		ToastActions.toastError(ToastError);
	}

	return null;
};

export const getMemo = (fromAccount, toAccount, memo, privateKey) => {
	const nonce = TransactionHelper.unique_nonce_uint64();

	return {
		from: fromAccount.options.memo_key,
		to: toAccount.options.memo_key,
		nonce,
		message: Aes.encryptWithChecksum(
			privateKey,
			toAccount.options.memo_key,
			nonce,
			memo,
		),
	};
};

export const getMemoFee = (globalObject, memo, privateKey = '5KGG3tFb5F4h3aiUSKNnKeDcNbL5y1ZVXQXVqpWVMYhW82zBrNb') => {
	const nonce = TransactionHelper.unique_nonce_uint64();
	const pKey = PrivateKey.fromWif(privateKey);
	const memoFromKey = 'ECHO7WBUN97NJfSXbDVDqLDQDKu8FasTb7YBdpbWoJF3RYo6qYY6aX';
	const memoToKey = 'ECHO7WBUN97NJfSXbDVDqLDQDKu8FasTb7YBdpbWoJF3RYo6qYY6aX';

	const message = Aes.encryptWithChecksum(pKey, memoToKey, nonce, memo);

	const memoObject = {
		from: memoFromKey,
		to: memoToKey,
		nonce,
		message,
	};

	const serialized = ops.memo_data.fromObject(memoObject);
	const stringified = JSON.stringify(ops.memo_data.toHex(serialized));
	const byteLength = Buffer.byteLength(stringified, 'hex');

	const optionFee = globalObject.getIn(['parameters', 'current_fees', 'parameters', 0, 1, 'price_per_kbyte']);

	return optionFee * (byteLength / 1024);
};

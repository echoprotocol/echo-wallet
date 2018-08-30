import { TransactionBuilder, TransactionHelper, Aes, PrivateKey, ops } from 'echojs-lib';

export const buildAndSendTransaction = async (operation, options, privateKey) => {
	const tr = new TransactionBuilder();
	tr.add_type_operation(operation, options);

	await tr.set_required_fees();
	tr.add_signer(privateKey);

	return tr.broadcast();
};

export const estimateCallContractFee = async (operation, options) => {
	const tr = new TransactionBuilder();
	tr.add_type_operation(operation, options);

	await tr.set_required_fees();

	return tr.operations[0][1].fee.amount;
};

export const encodeMemo = (fromAccount, toAccount, memo, privateKey) => {
	memo = Buffer.from(memo, 'utf-8');

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

export const decodeMemo = (memo, privateKey) => {
	const publicKey = privateKey.toPublicKey().toString();

	if (publicKey !== memo.from && publicKey !== memo.to) {
		return null;
	}

	return Aes.decryptWithChecksum(
		privateKey,
		publicKey === memo.from ? memo.to : memo.from,
		memo.nonce,
		memo.message,
	).toString('utf-8');
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

import { TransactionBuilder, TransactionHelper, Aes, PrivateKey, ops } from 'echojs-lib';

export const buildAndSendTransaction = async (operation, options, privateKey) => {
	const tr = new TransactionBuilder();

	tr.add_type_operation(operation, options);

	await tr.set_required_fees();

	tr.add_signer(privateKey);

	return tr.broadcast();
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

export const getMemoFee = (globalObject, memo, privateKey = '5KikQ23YhcM7jdfHbFBQg1G7Do5y6SgD9sdBZq7BqQWXmNH7gqo') => {
	const nonce = TransactionHelper.unique_nonce_uint64();
	const pKey = PrivateKey.fromWif(privateKey);
	const memoFromKey = 'BTS6B1taKXkDojuC1qECjvC7g186d8AdeGtz8wnqWAsoRGC6RY8Rp';
	const memoToKey = 'BTS8eLeqSZZtB1YHdw7KjQxRSRmaKAseCxhUSqaLxUdqvdGpp6nck';

	const message = Aes.encrypt_with_checksum(pKey, memoToKey, nonce, memo);

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

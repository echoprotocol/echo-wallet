import { TransactionBuilder, TransactionHelper, Aes } from 'echojs-lib';

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

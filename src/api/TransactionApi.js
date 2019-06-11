import { TransactionBuilder, TransactionHelper, Aes, PrivateKey } from 'echojs-lib';

export const buildAndSendTransaction = async (operation, options, privateKeys) => {
	const tr = new TransactionBuilder();

	tr.add_type_operation(operation, options);

	await tr.set_required_fees(options.fee.asset_id);
	privateKeys.map((privateKey) => tr.add_signer(privateKey));

	return tr.broadcast();
};

export const estimateCallContractFee = async (operation, options) => {
	const tr = new TransactionBuilder();

	tr.add_type_operation(operation, options);

	await tr.set_required_fees(options.asset_id || options.fee.asset_id);

	return tr.operations[0][1].fee.amount;
};

export const getOperationFee = async (type, options) => {
	if (options.memo) {
		const nonce = TransactionHelper.unique_nonce_uint64();

		const memoFromKey = 'ECHO7WBUN97NJfSXbDVDqLDQDKu8FasTb7YBdpbWoJF3RYo6qYY6aX';
		const memoToKey = 'ECHO7WBUN97NJfSXbDVDqLDQDKu8FasTb7YBdpbWoJF3RYo6qYY6aX';
		const wif = '5KGG3tFb5F4h3aiUSKNnKeDcNbL5y1ZVXQXVqpWVMYhW82zBrNb';
		const pKey = PrivateKey.fromWif(wif);

		const message = Aes.encryptWithChecksum(
			pKey,
			memoToKey,
			nonce,
			Buffer.from(options.memo, 'utf-8'),
		);

		options.memo = {
			from: memoFromKey,
			to: memoToKey,
			nonce,
			message,
		};
	}

	const tr = new TransactionBuilder();
	tr.add_type_operation(type, options);

	await tr.set_required_fees(options.asset_id);

	return tr.operations[0][1].fee.amount; // eslint-disable-line no-underscore-dangle
};

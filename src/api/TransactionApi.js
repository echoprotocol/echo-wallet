import { TransactionBuilder } from 'echojs-lib';

export const buildAndSendTransaction = async (operation, options, privateKey) => {
	const tr = new TransactionBuilder();

	tr.add_type_operation(operation, options);

	await tr.set_required_fees();

	tr.add_signer(privateKey);

	return tr.broadcast();
};

export default {};

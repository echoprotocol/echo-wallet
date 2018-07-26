import { TransactionBuilder } from 'echojs-lib';

export default ({ bytecode }) => async (dispatch) => {
	const tr = new TransactionBuilder();
	const options = {
		// fee: {
		// 	amount: 0,
		// 	asset_id: 0,
		// },
		registrar_account: '',
		asset_type: '1.3.0',
		code: bytecode,
		value: 0,
		gasPrice: 1,
		gas: 1,
		broadcast: true,
		save_wallet: true,
	};
	tr.add_type_operation('create_contract', options);
	// tr.set_required_fees();
	tr.add_signer();
	tr.sign();
	tr.broadcast();
};

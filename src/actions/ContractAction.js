import { TransactionBuilder } from 'echojs-lib';

export const createContract = ({ bytecode }) => async (dispatch) => {
	const tr = new TransactionBuilder();
	const options = {
		registrar_account: '',
		asset_type: 'ECHO',
		code: bytecode,
		value: 0,
		gasPrice: 1,
		gas: 2000000,
		broadcast: true,
		save_wallet: true,
	};
	tr.add_type_operation('create_contract', options);
	tr.add_signer();
	tr.sign();
};

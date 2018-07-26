/* eslint-disable import/prefer-default-export */
import { Map } from 'immutable';

import { setTransactionValue, resetTransactionValues } from './TransactionBuilderActions';


import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';

import { openModal } from './ModalActions';

export const createContract = ({ bytecode }) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);

	if (!activeUserId || !activeUserName) return;

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) return;

	dispatch(resetTransactionValues());

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);

	const options = {
		operation: 'create_contract',
		registrar_account: activeUserName,
		asset_type: '1.3.0',
		code: bytecode,
		value: 0,
		gasPrice: 0,
		gas: 100000,
		broadcast: true,
		save_wallet: true,
	};


	dispatch(setTransactionValue('transaction', new Map(options)));

	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setTransactionValue('privateKey', privateKey));
		dispatch(openModal(MODAL_DETAILS));
	}

	dispatch(setTransactionValue('onBuild', true));
	// account
	// const tr = new TransactionBuilder();

	// tr.add_type_operation('create_contract', options);
	// // tr.set_required_fees();
	// tr.add_signer();
	// tr.sign();
	// tr.broadcast();
};

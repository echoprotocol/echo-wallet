/* eslint-disable import/prefer-default-export */
import { Map } from 'immutable';

import { openModal, closeModal } from './ModalActions';
import { clearForm } from './FormActions';
import { setTransactionValue, resetTransactionValues } from './TransactionBuilderActions';

import { buildAndMakeRequest } from '../api/ContractApi';

import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';
import { FORM_TRANSACTION_DETAILS } from '../constants/FormConstants';

export const createContract = ({ bytecode }) => async (dispatch, getState) => {

	const activeUserId = getState().global.getIn(['activeUser', 'id']);
	const activeUserName = getState().global.getIn(['activeUser', 'name']);

	if (!activeUserId || !activeUserName) return;

	const pubKey = getState().echojs.getIn(['data', 'accounts', activeUserId, 'active', 'key_auths', '0', '0']);

	if (!pubKey) return;

	dispatch(resetTransactionValues());

	const privateKey = getState().keychain.getIn([pubKey, 'privateKey']);

	const options = {
		registrar: activeUserId,
		asset_id: '1.3.0',
		value: 0,
		gasPrice: 0,
		gas: 100000,
		code: bytecode,
	};

	dispatch(setTransactionValue('transaction', new Map(options)));
	dispatch(setTransactionValue('operation', 'contract'));

	if (!privateKey) {
		dispatch(openModal(MODAL_UNLOCK));
	} else {
		dispatch(setTransactionValue('privateKey', privateKey));
		dispatch(openModal(MODAL_DETAILS));
	}

	dispatch(setTransactionValue('onBuild', true));
};

export const makeRequest = (details) => (dispatch) => {
	details = details.toJS();
	const { operation, privateKey, transaction } = details;
	buildAndMakeRequest(operation, transaction, privateKey);
	dispatch(closeModal(MODAL_DETAILS));
	dispatch(clearForm(FORM_TRANSACTION_DETAILS));
	dispatch(resetTransactionValues());
};

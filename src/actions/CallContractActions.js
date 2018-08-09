import { EchoJSActions } from 'echojs-redux';

import { FORM_CALL_CONTRACT } from '../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../constants/ModalConstants';

import { setFormError, setFormValue, clearForm } from './FormActions';
import { openModal, closeModal } from './ModalActions';
import { resetTransaction, fetchFee } from './TransactionActions';

import { validateCode } from '../helpers/TransactionHelper';

import { buildAndSendTransaction, getMemo, getMemoFee } from '../api/TransactionApi';

import ContractReducer from '../reducers/ContractReducer';


import { INDEX_PATH } from '../constants/RouterConstants';

export const setFunction = (functionName) => (dispatch, getState) => {
	const functions = getState().contract.get('functions') || [];

	const targetFunction = functions.find((f) => (f.name === functionName));

	if (!targetFunction) return;

	dispatch(clearForm(FORM_CALL_CONTRACT));

	targetFunction.inputs.forEach((i) => {
		dispatch(setFormValue(FORM_CALL_CONTRACT, i.name, ''));
	});

	if (!targetFunction.payable) return;

	dispatch(setFormValue(FORM_CALL_CONTRACT, 'amount', ''));
};



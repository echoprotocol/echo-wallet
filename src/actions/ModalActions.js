import ModalReducer from './../reducers/ModalReducer';
import { MODAL_UNLOCK } from '../constants/ModalConstants';
import { FORM_UNLOCK_MODAL } from '../constants/FormConstants';

import { clearForm } from '../actions/FormActions';

export const openModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
	dispatch(clearForm(FORM_UNLOCK_MODAL));
};

export const openUnlockModal = () => (dispatch) => {
	dispatch(openModal(MODAL_UNLOCK));
};

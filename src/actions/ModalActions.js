import ModalReducer from './../reducers/ModalReducer';
import { MODAL_UNLOCK } from '../constants/ModalConstants';

export const openModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};

export const openUnlockModal = () => (dispatch) => {
	dispatch(openModal(MODAL_UNLOCK));
};

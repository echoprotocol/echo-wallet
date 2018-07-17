import ModalReducer from './../reducers/ModalReducer';

export const openModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};

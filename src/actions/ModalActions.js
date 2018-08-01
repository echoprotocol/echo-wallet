import ModalReducer from './../reducers/ModalReducer';

export const openModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};

export const setParamValue = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamValue({ type, param, value }));
};

export const setParamError = (type, param, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamError({ type, param, error }));
};
export const setError = (type, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setError({ type, error }));
};

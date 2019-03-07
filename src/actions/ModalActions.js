import ModalReducer from './../reducers/ModalReducer';

export const openModal = (type, field, value) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type, field, value }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};
export const update = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.update({ type, param, value }));
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
export const setDisable = (type, value) => (dispatch) => {
	dispatch(ModalReducer.actions.setDisable({ type, value }));
};


import ModalReducer from '../reducers/ModalReducer';

/**
 * @method openModal
 *
 * @param {*} type
 * @param {*} params
 */
export const openModal = (type, params) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type, params }));
};

/**
 * @method closeModal
 *
 * @param {*} type
 */
export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};
/**
 * @method update
 *
 * @param {*} type
 * @param {*} param
 * @param {*} value
 */
export const update = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.update({ type, param, value }));
};
/**
 * @method setParamValue
 *
 * @param {*} type
 * @param {*} param
 * @param {*} value
 */
export const setParamValue = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamValue({ type, param, value }));
};

/**
 * @method setParamError
 *
 * @param {*} type
 * @param {*} param
 * @param {*} error
 */
export const setParamError = (type, param, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamError({ type, param, error }));
};
/**
 * @method setError
 *
 * @param {*} type
 * @param {*} error
 */
export const setError = (type, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setError({ type, error }));
};
/**
 * @method toggleLoading
 *
 * @param {*} type
 * @param {*} value
 */
export const toggleLoading = (type, value) => (dispatch) => {
	dispatch(ModalReducer.actions.toggleLoading({ type, value }));
};

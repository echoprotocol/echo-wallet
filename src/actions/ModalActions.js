import ModalReducer from '../reducers/ModalReducer';

/**
 * @method openModal
 *
 * @param {String} type
 * @param {Array} params
 * @returns {function(dispatch): undefined}
 */
export const openModal = (type, params) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type, params }));
};

/**
 * @method closeModal
 *
 * @param {String} type
 * @returns {function(dispatch): undefined}
 */
export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};
/**
 * @method update
 *
 * @param {String} type
 * @param {String} param
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const update = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.update({ type, param, value }));
};
/**
 * @method setParamValue
 *
 * @param {String} type
 * @param {String} param
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const setParamValue = (type, param, value) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamValue({ type, param, value }));
};

/**
 * @method setParamError
 *
 * @param {String} type
 * @param {String} param
 * @param {String} error
 * @returns {function(dispatch): undefined}
 */
export const setParamError = (type, param, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setParamError({ type, param, error }));
};
/**
 * @method setError
 *
 * @param {String} type
 * @param {String} error
 * @returns {function(dispatch): undefined}
 */
export const setError = (type, error) => (dispatch) => {
	dispatch(ModalReducer.actions.setError({ type, error }));
};
/**
 * @method toggleLoading
 *
 * @param {String} type
 * @param {any} value
 * @returns {function(dispatch): undefined}
 */
export const toggleLoading = (type, value) => (dispatch) => {
	dispatch(ModalReducer.actions.toggleLoading({ type, value }));
};

import FormReducer from '../reducers/FormReducer';

/**
 * @method setValue
 * Set value by field
 * @param form
 * @param field
 * @param value
 * @returns {Function}
 */
export const setValue = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.set({ form, field, value }));
};

/**
 * @method setFormValue
 * Set value by field for object {value, error}
 * @param form
 * @param field
 * @param value
 * @returns {Function}
 */
export const setFormValue = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.setFormValue({ form, field, value }));
};

/**
 * @method setFormError
 * Set error by field form
 * @param {String} form
 * @param {String} field
 * @param {String} value
 * @returns {Function}
 */
export const setFormError = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.setFormError({ form, field, value }));
};

/**
 * @method toggleLoading
 * Toggle loading
 * This function used for form and button loading.
 * You can call this with 2 params(without loading for button loading)
 * and with 3 params(for form loading).
 * If you call without third param(loading), loading equals field,
 * and field equals null(because field doesn't used
 * in button reducer.
 * @param {String} form
 * @param {String|Boolean} field
 * @param {Boolean} [loading]
 * @returns {undefined}
 */
export const toggleLoading = (form, field, loading) => (dispatch) => {
	if (typeof loading === 'undefined') {
		loading = field;
		field = null;
	}
	dispatch(FormReducer.actions.toggleLoading({
		form,
		field,
		value: loading,
	}));
};

/**
 * @method clearForm
 * Clear form
 * @param {String} form
 * @returns {Function}
 */
export const clearForm = (form) => (dispatch) => {
	dispatch(FormReducer.actions.clearForm({ form }));
};

/**
 * @method clearByField
 * Clear by field
 * @param {String} form
 * @param {String} field
 * @returns {Function}
 */
export const clearByField = (form, field) => (dispatch) => {
	dispatch(FormReducer.actions.clearByField({ form, field }));
};

/**
 * @method setIn
 * Set multiple params by field
 * @param {String} form
 * @param {String} field
 * @param {Object} params
 * @returns {Function}
 */
export const setIn = (form, field, params) => (dispatch) => {
	dispatch(FormReducer.actions.setIn({ form, field, params }));
};

/**
 * @method pushForm
 *
 * @param {String} form
 * @param {String} field
 * @param {String} value
 * @returns {undefined}
 */
export const pushForm = (form, field, value) => (dispatch) => {

	dispatch(FormReducer.actions.push({
		form,
		field,
		value,
	}));
};

/**
 * @method deleteValue
 *
 * @param {String} form
 * @param {String} field
 * @param {String} value
 * @returns {undefined}
 */
export const deleteValue = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.deleteValue({
		form,
		field,
		value,
	}));
};

/**
 * @method setInFormValue
 * Set multiple params by field
 * @param {String} form
 * @param {Array} fields
 * @param {String} value
 * @returns {Function}
 */
export const setInFormValue = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormValue({ form, fields, value }));
};

/**
 * @method setInFormError
 * Set multiple params by field
 * @param {String} form
 * @param {Array} fields
 * @param {String} value
 * @returns {Function}
 */
export const setInFormError = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormError({ form, fields, value }));
};

/**
 * @method setInFormErrorConstant
 * Set multiple params by field for constant
 * @param {String} form
 * @param {Array} fields
 * @param {String} value
 * @returns {Function}
 */
export const setInFormErrorConstant = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormErrorConstant({ form, fields, value }));
};

/**
 * @method removeKey
 * Remove permission key
 * @param {String} form
 * @param {Array} fields
 * @returns {Function}
 */
export const removeKey = (form, fields) => (dispatch) => {
	dispatch(FormReducer.actions.removeKey({ form, fields }));
};

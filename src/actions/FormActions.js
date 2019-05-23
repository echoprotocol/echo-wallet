import FormReducer from '../reducers/FormReducer';

/**
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
 * Set error by field form
 * @param form
 * @param field
 * @param value
 * @returns {Function}
 */
export const setFormError = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.setFormError({ form, field, value }));
};

/**
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
 * Clear form
 * @param {String} form
 * @returns {Function}
 */
export const clearForm = (form) => (dispatch) => {
	dispatch(FormReducer.actions.clearForm({ form }));
};

/**
 * Clear by field
 * @param {String} form
 * @param {String} field
 * @returns {Function}
 */
export const clearByField = (form, field) => (dispatch) => {
	dispatch(FormReducer.actions.clearByField({ form, field }));
};

/**
 * Set multiple params by field
 * @param {String} form
 * @param {String} field
 * @param {Object} params
 * @returns {Function}
 */
export const setIn = (form, field, params) => (dispatch) => {
	dispatch(FormReducer.actions.setIn({ form, field, params }));
};

export const pushForm = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.push({
		form,
		field,
		value,
	}));
};

export const deleteValue = (form, field, value) => (dispatch) => {
	dispatch(FormReducer.actions.deleteValue({
		form,
		field,
		value,
	}));
};

/**
 * Set multiple params by field
 * @param {String} form
 * @param {Array} fields
 * @param value
 * @returns {Function}
 */
export const setInFormValue = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormValue({ form, fields, value }));
};

/**
 * Set multiple params by field
 * @param {String} form
 * @param {Array} fields
 * @param value
 * @returns {Function}
 */
export const setInFormError = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormError({ form, fields, value }));
};

/**
 * Set multiple params by field for constant
 * @param {String} form
 * @param {Array} fields
 * @param value
 * @returns {Function}
 */
export const setInFormErrorConstant = (form, fields, value) => (dispatch) => {
	dispatch(FormReducer.actions.setInFormErrorConstant({ form, fields, value }));
};

/**
 * Remove permission key
 * @param {String} form
 * @param {Array} fields
 * @returns {Function}
 */
export const removeKey = (form, fields) => (dispatch) => {
	dispatch(FormReducer.actions.removeKey({ form, fields }));
};

import ModalReducer from './../reducers/ModalReducer';

export default class ModalActions {

	/**
	 *
	 * @param {Object} params
	 * @param {String} params.title
	 * @param {String} params.text
	 * @param {String} params.btnYes
	 * @param {String} params.btnNo
	 * @param {Function} params.callbackCancel
	 * @param {Function} params.callbackYes
	 * @return {function(*)}
	 */
	static showConfirm(params = {}) {
		return (dispatch) => new Promise((resolve) => {
			params.title = params.title || '';
			params.text = params.text || '';
			params.btnYes = params.btnYes || undefined;
			params.btnNo = params.btnNo || undefined;
			params.callbackYes = params.callbackYes || (() => {});
			params.callbackCancel = params.callbackCancel || (() => {});
			dispatch(ModalReducer.actions.showConfirm(params));
			resolve();
		});
	}

	/**
	 *
	 * @return {function(*)}
	 */
	static closeConfirm() {
		return (dispatch) => new Promise((resolve) => {
			dispatch(ModalReducer.actions.closeConfirm());
			resolve();
		});
	}


}

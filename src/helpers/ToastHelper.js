import { toast } from 'react-toastify';

import { TIME_TOAST_ANIMATION } from '../constants/GlobalConstants';

import ToastInfo from '../components/Toast/ToastInfo';
import ToastSuccess from '../components/Toast/ToastSuccess';
import ToastError from '../components/Toast/ToastError';

/**
 * @method toastSuccess
 * @param {String} text
 * @returns {undefined}
 */
export const toastSuccess = (text) => {
	toast.success(ToastSuccess(text), {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

/**
 * @method toastInfo
 * @param {String} text
 * @param {Function} onUndo
 * @param {Function} onOpen
 * @returns {undefined}
 */
export const toastInfo = (text, onUndo, onOpen) => {
	toast.info(ToastInfo(text, onUndo), {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
		onOpen,
	});
};

/**
 * @method toastSuccess
 * @param {String} text
 * @returns {undefined}
 */
export const toastError = (text) => {
	toast.error(ToastError(text), {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

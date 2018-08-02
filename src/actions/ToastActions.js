import { toast } from 'react-toastify';

class ToastActionsClass {

	/**
	 * Toast about successful event
	 * @param {string} text
	 */
	toastSuccess(text) {
		toast.success(text, {
			position: 'bottom-right',
			autoClose: 3000,
			hideProgressBar: true,
		});
	}

	/**
	 * Toast with information message
	 * @param {string} text
	 */
	toastInfo(text) {
		toast.info(text, {
			autoClose: 3000,
			position: 'bottom-right',
			hideProgressBar: true,
		});
	}

	/**
	 * Toast about unsuccessful event
	 * @param {string} text
	 */
	toastError(text) {
		toast.error(text, {
			autoClose: 3000,
			position: 'bottom-right',
			hideProgressBar: true,
		});
	}

}

const ToastActions = new ToastActionsClass();
export default ToastActions;

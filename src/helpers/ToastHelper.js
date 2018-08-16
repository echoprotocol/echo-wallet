import { toast } from 'react-toastify';

import ToastInfo from '../components/Toast/ToastInfo';

export const toastSuccess = (text) => {
	toast.success(text, {
		position: 'bottom-right',
		autoClose: 5000,
		hideProgressBar: true,
	});
};

export const toastInfo = (text, onUndo, onClose) => {
	toast.info(ToastInfo(text, onUndo), {
		autoClose: 5000,
		position: 'bottom-right',
		hideProgressBar: true,
		pauseOnHover: true,
		onClose,
	});
};

export const toastError = (text) => {
	toast.error(text, {
		autoClose: 5000,
		position: 'bottom-right',
		hideProgressBar: true,
	});
};

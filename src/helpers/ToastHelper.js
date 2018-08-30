import { toast } from 'react-toastify';

import ToastInfo from '../components/Toast/ToastInfo';

export const toastSuccess = (text) => {
	toast.success(text, {
		autoClose: 5000,
		position: 'bottom-right',
		hideProgressBar: true,
		pauseOnHover: true,
		pauseOnFocusLoss: false,
	});
};

export const toastInfo = (text, onUndo, onClose) => {
	toast.info(ToastInfo(text, onUndo), {
		autoClose: 5000,
		position: 'bottom-right',
		hideProgressBar: true,
		pauseOnHover: true,
		pauseOnFocusLoss: false,
		onClose,
	});
};

export const toastError = (text) => {
	toast.error(text, {
		autoClose: 5000,
		position: 'bottom-right',
		hideProgressBar: true,
		pauseOnHover: true,
		pauseOnFocusLoss: false,
	});
};

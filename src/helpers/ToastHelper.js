import { toast } from 'react-toastify';

import ToastInfo from '../components/Toast/ToastInfo';
import ToastSuccess from '../components/Toast/ToastSuccess';


export const toastSuccess = (text) => {
	toast.success(ToastSuccess(text), {
		autoClose: 5000,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

export const toastInfo = (text, onUndo, onClose) => {
	toast.info(ToastInfo(text, onUndo), {
		autoClose: 5000,
		position: 'bottom-right',
		pauseOnHover: true,
		onClose,
	});
};

export const toastError = (text) => {
	toast.error(text, {
		autoClose: 5000,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

import { toast } from 'react-toastify';

import { TIME_TOAST_ANIMATION } from '../constants/GlobalConstants';

import ToastInfo from '../components/Toast/ToastInfo';
import ToastSuccess from '../components/Toast/ToastSuccess';


export const toastSuccess = (text) => {
	toast.success(ToastSuccess(text), {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

export const toastInfo = (text, onUndo, onOpen) => {
	toast.info(ToastInfo(text, onUndo), {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
		onOpen,
	});
};

export const toastError = (text) => {
	toast.error(text, {
		autoClose: TIME_TOAST_ANIMATION,
		position: 'bottom-right',
		pauseOnHover: true,
	});
};

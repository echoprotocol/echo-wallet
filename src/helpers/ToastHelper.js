import { toast } from 'react-toastify';

export const toastSuccess = (text) => {
	toast.success(text, {
		position: 'bottom-right',
		autoClose: 3000,
		hideProgressBar: true,
	});
};

export const toastInfo = (text) => {
	toast.info(text, {
		autoClose: 3000,
		position: 'bottom-right',
		hideProgressBar: true,
	});
};

export const toastError = (text) => {
	toast.error(text, {
		autoClose: 3000,
		position: 'bottom-right',
		hideProgressBar: true,
	});
};

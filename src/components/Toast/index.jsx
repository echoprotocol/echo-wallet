import React from 'react';
import { ToastContainer } from 'react-toastify';

const containerStyle = {
	zIndex: 1999,
};

const Toast = () => (
	<ToastContainer
		style={containerStyle}
	/>
);

export default Toast;

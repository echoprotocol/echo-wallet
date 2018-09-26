import React from 'react';


// const ToastSuccess = () => (
// 	<React.Fragment>
// 		<span className="toast-icon icon-checked-white" />
// 		<span className="toast-text">Transaction has been send</span>
// 	</React.Fragment>
// );

// export default ToastSuccess;


const ToastSuccess = (text) => (
	<React.Fragment>
		<span className="toast-icon icon-checked-white" />
		<span className="toast-text">{ text }</span>
	</React.Fragment>
);

export default ToastSuccess;

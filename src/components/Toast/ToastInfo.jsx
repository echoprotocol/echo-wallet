import React from 'react';
import { Button } from 'semantic-ui-react';

const ToastInfo = (text, onUndo) => (
	<React.Fragment>
		<Button className="toast-loading" loading />
		<span className="toast-text">{ text }</span>
		<Button type="button" size="tiny" content="Undo" color="black" onClick={() => onUndo()} />
	</React.Fragment>
);

export default ToastInfo;

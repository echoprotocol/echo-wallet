import React from 'react';
import { Button } from 'semantic-ui-react';

const ToastInfo = (text, onUndo) => (
	<React.Fragment>
		<span className="toast-text">{ text }</span>
		<Button
			type="button"
			compact
			className="black-btn"
			content="Undo"
			onClick={() => onUndo()}
		/>
	</React.Fragment>
);

export default ToastInfo;

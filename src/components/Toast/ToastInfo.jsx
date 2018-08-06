import React from 'react';
import { Button } from 'semantic-ui-react';

const ToastInfo = () => (
	<React.Fragment>
		<Button className="toast-loading" loading />
		<span className="toast-text">You have removed {'"MyContract"'} from watchlist</span>
		<Button size="tiny" content="Undo" color="black" />
	</React.Fragment>
);

export default ToastInfo;

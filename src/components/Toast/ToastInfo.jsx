import React from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const ToastInfo = (text, onUndo) => (
	<React.Fragment>
		<span className="toast-text">
			{
				text.map((t) => (
					<React.Fragment>
						{t.text}
						{t.postfix && <FormattedMessage id={t.postfix} />}
					</React.Fragment>
				))
			}
		</span>
		<Button
			size="small"
			className="black-btn"
			content="Undo"
			onClick={() => onUndo()}
		/>
	</React.Fragment>
);

export default ToastInfo;

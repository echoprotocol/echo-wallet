import React from 'react';
import { FormattedMessage } from 'react-intl';


const ToastError = (text) => (
	<React.Fragment>
		<span className="toast-icon icon-close-white" />
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
	</React.Fragment>
);

export default ToastError;

import React from 'react';
import { FormattedMessage } from 'react-intl';

const ToastSuccess = (text) => (
	<React.Fragment>
		<span className="toast-icon icon-checked-white" />
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

export default ToastSuccess;

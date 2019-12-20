import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Popup } from 'semantic-ui-react';

function LocalNode(props) {
	const popupText = props.intl.formatMessage({ id: 'footer.local_node.popup_info' });

	return (
		<div className="node-label">
			<div className="node-title">
				<FormattedMessage id="footer.local_node.title" />
			</div>
			<Popup
				trigger={<span className="icon-info" />}
				content={popupText}
				className="inner-tooltip"
				position="top center"
				style={{ width: 200 }}
			/>
		</div>
	);
}

LocalNode.propTypes = {
	intl: PropTypes.any.isRequired,
};

export default injectIntl(LocalNode);

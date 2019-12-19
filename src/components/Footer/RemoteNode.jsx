import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Popup } from 'semantic-ui-react';

import ProgressLine from '../ProgressLine';

function RemoteNode(props) {
	const popupText = props.intl.formatMessage({ id: 'footer.remote_node.popup_info' });
	return (
		<React.Fragment>
			<div className="node-label">
				<div className="node-title">
					<FormattedMessage id="footer.remote_node.title" />
				</div>
				<div className="sync">
					<div className="percent">
						{props.value}
						<span className="symbol">%</span>
					</div>
					<Popup
						trigger={<span className="icon-info" />}
						content={popupText}
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 200 }}
					/>
				</div>
			</div>
			<div className="sync-progress">
				<div className="sync-label">
					<FormattedMessage id="footer.remote_node.synchronization" />
				</div>
				<ProgressLine value={props.value} />
			</div>
		</React.Fragment>
	);
}

RemoteNode.propTypes = {
	value: PropTypes.number,
	intl: PropTypes.any.isRequired,
};

RemoteNode.defaultProps = {
	value: 0,
};

export default injectIntl(RemoteNode);

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';

import { MODAL_ACCEPT_RUNNING_NODE } from '../../constants/ModalConstants';
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
					{(props.isNodePaused || props.isNodeSyncing) &&
						<div className="percent">
							{props.value}
							<span className="symbol">%</span>
						</div>}
					<Popup
						trigger={<span className="icon-info" />}
						content={popupText}
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 200 }}
					/>
				</div>
			</div>
			{(!props.isNodePaused && !props.isNodeSyncing) ?
				<div className="sync-progress">
					<div className="sync-label">
						<button onClick={(e) => {
							e.preventDefault();
							props.openModal(MODAL_ACCEPT_RUNNING_NODE);
						}}
						>
							<FormattedMessage id="footer.remote_node.incoming_connections" />
						</button>
					</div>
				</div> :
				<div className="sync-progress">
					<div className="sync-label">
						{props.isNodePaused ?
							<FormattedMessage id="footer.remote_node.synchronization_paused" /> :
							<FormattedMessage id="footer.remote_node.synchronization" />}
					</div>
					<ProgressLine value={props.value} />
				</div>}
		</React.Fragment>
	);
}

RemoteNode.propTypes = {
	value: PropTypes.number,
	isNodePaused: PropTypes.bool,
	isNodeSyncing: PropTypes.bool,
	intl: PropTypes.any.isRequired,
	openModal: PropTypes.func.isRequired,
};

RemoteNode.defaultProps = {
	value: 0,
	isNodePaused: false,
	isNodeSyncing: false,
};

export default injectIntl(RemoteNode);

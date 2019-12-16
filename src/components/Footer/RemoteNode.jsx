import React from 'react';
import PropTypes from 'prop-types';

import { Popup } from 'semantic-ui-react';

import ProgressLine from '../ProgressLine';

function RemoteNode(props) {
	return (
		<React.Fragment>
			<div className="node-label">
				<div className="node-title">
					Remote Node
				</div>
				<div className="sync">
					<div className="percent">
						{props.value}
						<span className="symbol">%</span>
					</div>
					<Popup
						trigger={<span className="icon-info" />}
						content="You can specify the amount to be sent with contract creation. Leave blank if the constructor of your contract is not payable."
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 200 }}
					/>
				</div>
			</div>
			<div className="sync-progress">
				<div className="sync-label">
					Network synchronization
				</div>
				<ProgressLine value={props.value} />
			</div>
		</React.Fragment>
	);
}

RemoteNode.propTypes = {
	value: PropTypes.number,
};

RemoteNode.defaultProps = {
	value: 0,
};

export default RemoteNode;

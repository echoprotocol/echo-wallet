import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';


function VerificationField(props) {

	return (
		<div className="action-tooltip">
			<div className="action-tooltip-wrap">
				<span className="arrow" />
				<div className="action-tooltip-header">You can save IP or URL to use it next time</div>
				<div className="action-tooltip-panel">
					<Button
						className="main-btn small"
						onClick={() => props.onDismiss()}
						content="Dismiss"
					/>
					<Button
						className="main-btn small"
						onClick={() => props.onConfirm()}
						content="Save"
					/>
				</div>
			</div>
		</div>
	);
}


VerificationField.propTypes = {
	onConfirm: PropTypes.func.isRequired,
	onDismiss: PropTypes.func.isRequired,
};

VerificationField.defaultProps = {
};

export default VerificationField;

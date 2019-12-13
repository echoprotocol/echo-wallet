import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
// import classnames from 'classnames';


function VerificationField(props) {
	// const {} = props;

	return (
		<div className="action-tooltip">
			<div className="action-tooltip-wrap">
				<span className="arrow" />
				<div className="action-tooltip-header">You can save IP or URL to use it next time</div>
				<div className="action-tooltip-panel">
					<Button
						className="main-btn small"
						onClick={(e) => props.onDismiss(e.target.value)}
						content="Dismiss"
					/>
					<Button
						className="main-btn small"
						onClick={(e) => props.onConfirm(e.target.value)}
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

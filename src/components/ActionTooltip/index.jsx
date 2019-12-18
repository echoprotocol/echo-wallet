import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'semantic-ui-react';


function VerificationField(props) {

	return (
		<div className="action-tooltip">
			<div className="action-tooltip-wrap">
				<span className="arrow" />
				<div className="action-tooltip-header">
					<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.popup" />
				</div>
				<div className="action-tooltip-panel">
					<Button
						className="main-btn small"
						onClick={(e) => props.onDismiss(e.target.value)}
						content="sign_page.register_account_page.more_options_section.ip_url_section.dismiss"
					/>
					<Button
						className="main-btn small"
						onClick={(e) => props.onConfirm(e.target.value)}
						content="sign_page.register_account_page.more_options_section.ip_url_section.save"
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

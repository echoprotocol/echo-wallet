import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';


function ActionTooltip(props) {

	const confirmContent = props.intl.formatMessage({ id: 'sign_page.register_account_page.more_options_section.ip_url_section.save' });
	const dismissContent = props.intl.formatMessage({ id: 'sign_page.register_account_page.more_options_section.ip_url_section.dismiss' });
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
						onClick={() => props.onDismiss()}
						content={dismissContent}
					/>
					<Button
						className="main-btn small"
						onClick={() => props.onConfirm()}
						content={confirmContent}
					/>
				</div>
			</div>
		</div>
	);
}


ActionTooltip.propTypes = {
	onConfirm: PropTypes.func.isRequired,
	onDismiss: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(ActionTooltip);

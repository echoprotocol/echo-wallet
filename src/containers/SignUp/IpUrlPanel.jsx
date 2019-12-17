import React from 'react';
// import PropTypes from 'prop-types';
// import VerificationField from '../../components/Fields/VerificationField';
import { FormattedMessage } from 'react-intl';
import DropdownIpUrl from '../../components/DropdownIpUrl';

// import ActionTooltip from '../../components/ActionTooltip';

function IpUrlPanel() {

	// const { loading, ipOrUrl } =  props;

	return (
		<React.Fragment>
			<div className="register-info">
				<p><FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.text" /></p>
			</div>
			<div className="field-wrap">

				<DropdownIpUrl
					status="checked" // or error
				/>
				{/* <ActionTooltip /> */}

			</div>
		</React.Fragment>
	);

}


IpUrlPanel.propTypes = {
	// loading: PropTypes.bool.isRequired,
	// ipOrUrl: PropTypes.object.isRequired,
	// setFormValue: PropTypes.func.isRequired,
};

export default IpUrlPanel;

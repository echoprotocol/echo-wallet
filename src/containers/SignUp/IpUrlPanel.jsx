import React from 'react';
import PropTypes from 'prop-types';
// import VerificationField from '../../components/Fields/VerificationField';
import DropdownIpUrl from '../../components/DropdownIpUrl';

import ActionTooltip from '../../components/ActionTooltip';

function IpUrlPanel() {

	// const { loading, ipOrUrl } =  props;

	return (

		<React.Fragment>
			<div className="register-info">
				<p>Register a new account through a running node.</p>
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
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
};

export default IpUrlPanel;

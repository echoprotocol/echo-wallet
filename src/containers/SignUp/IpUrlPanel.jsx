import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DropdownIpUrl from '../../components/DropdownIpUrl';
import ActionTooltip from '../../components/ActionTooltip';

function IpUrlPanel(props) {

	const { loading, signupOptionsForm } = props;

	return (

		<React.Fragment>
			<div className="register-info">
				<p>Register a new account through a running node.</p>
			</div>
			<div className={classnames('field error-wrap', { error: true })}>

				<DropdownIpUrl
					status="checked" // or error
				/>
				{
					signupOptionsForm.get('showSaveAddressTooltip') && (
						<ActionTooltip
							onConfirm={props.saveRemoteAddress}
							onDismiss={props.hideSaveAddressTooltip}
						/>
					)
				}
				{
					true && <span className="error-message">Some error</span>
				}
			</div>
		</React.Fragment>
	);

}


IpUrlPanel.propTypes = {
	loading: PropTypes.bool.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	saveRemoteAddress: PropTypes.func.isRequired,
	hideSaveAddressTooltip: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
};

export default IpUrlPanel;

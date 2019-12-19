import React from 'react';
// import PropTypes from 'prop-types';
// import VerificationField from '../../components/Fields/VerificationField';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import DropdownIpUrl from '../../components/DropdownIpUrl';
import ActionTooltip from '../../components/ActionTooltip';

function IpUrlPanel(props) {

	const {
		loading,
		signupOptionsForm,
		setValue,
		setFormValue,
		remoteRegistrationAddresses,
		validateAndSetIpOrUrl,
	} = props;
	const ipOrUrl = signupOptionsForm.get('ipOrUrl');
	return (

		<React.Fragment>
			<div className="register-info">
				<p><FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.text" /></p>
			</div>
			<div className={classnames('field error-wrap', { error: !!ipOrUrl.error })}>

				<DropdownIpUrl
					status={signupOptionsForm.get('ipOrUrlStatus')}
					loading={loading}
					signupOptionsForm={signupOptionsForm}
					remoteRegistrationAddresses={remoteRegistrationAddresses}
					setFormValue={setFormValue}
					setValue={setValue}
					validateAndSetIpOrUrl={validateAndSetIpOrUrl}
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
					ipOrUrl.error && <span className="error-message">{ipOrUrl.error}</span>
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
	validateAndSetIpOrUrl: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	remoteRegistrationAddresses: PropTypes.object.isRequired,
};

export default IpUrlPanel;

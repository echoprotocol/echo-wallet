import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import classnames from 'classnames';

import DropdownIpUrl from '../../components/DropdownIpUrl';
import ActionTooltip from '../../components/ActionTooltip';
import ErrorMessage from '../../components/ErrorMessage';

function IpUrlPanel(props) {

	const {
		loading, intl,
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
				<p>
					<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.text" />
				</p>
			</div>
			<div className="field-wrap">
				<div className={classnames('field', { error: !!ipOrUrl.error })}>
					<label htmlFor="idUrlDropdown">Ip or Url</label>
					<div className="action-wrap">
						<DropdownIpUrl
							name="idUrlDropdown"
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
						<ErrorMessage
							value={ipOrUrl.error}
							intl={intl}
						/>
					</div>
				</div>
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
	intl: PropTypes.any.isRequired,
};
export default injectIntl(IpUrlPanel);

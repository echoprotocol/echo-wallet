import React from 'react';
import { FormattedMessage } from 'react-intl';

class DefaultSettingsPanel extends React.Component {

	render() {

		return (
			<div className="register-info">
				<p>
					<FormattedMessage id="sign_page.register_account_page.more_options_section.default_settings_section.text_pt1" />
				</p>
				<p>
					<FormattedMessage id="sign_page.register_account_page.more_options_section.default_settings_section.text_pt2" />
				</p>
			</div>
		);
	}

}

DefaultSettingsPanel.propTypes = {};

export default DefaultSettingsPanel;

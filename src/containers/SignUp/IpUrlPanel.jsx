import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

class IpUrlPanel extends React.Component {

	render() {
		const { loading, ipOrUrl } = this.props;

		return (
			<React.Fragment>
				<div className="register-info">
					<p>
						<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.text" />
					</p>
				</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: !!ipOrUrl.error })}>
						<label htmlFor="accountName">
							<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.dropdown.title" />
						</label>
						<input
							name="IpUrl"
							disabled={loading}
							placeholder={
								<FormattedMessage id="sign_page.register_account_page.more_options_section.ip_url_section.dropdown.placeholder" />
							}
							value={ipOrUrl.value}
							onChange={(e) => this.props.setFormValue('ipOrUrl', e.target.value)}
						/>
						{ ipOrUrl.error && <span className="error-message">{ipOrUrl.error}</span> }
					</Form.Field>
				</div>
			</React.Fragment>
		);
	}

}


IpUrlPanel.propTypes = {
	loading: PropTypes.bool.isRequired,
	ipOrUrl: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default IpUrlPanel;

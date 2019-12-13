import React from 'react';
import PropTypes from 'prop-types';
import VerificationField from '../../components/Fields/VerificationField';

class IpUrlPanel extends React.Component {

	render() {
		const { loading, ipOrUrl } = this.props;

		return (
			<React.Fragment>
				<div className="register-info">
					<p>Register a new account through a running node.</p>
				</div>
				<div className="field-wrap">
					<VerificationField
						value={ipOrUrl.value}
						name="IpUrl"
						label="IP or URL"
						status="checked"
						onChange={(value) => this.props.setFormValue('ipOrUrl', value)}
						loading={false}
						error={ipOrUrl.error}
						disabled={loading}
					/>
					<div className="action-tooltip">
						<div className="header">You can save IP or URL to use it next time</div>
						<div className="panel">dsd</div>
					</div>
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

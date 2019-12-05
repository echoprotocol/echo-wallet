import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

class IpUrlPanel extends React.Component {

	render() {
		const { loading, ipOrUrl } = this.props;

		return (
			<React.Fragment>
				<p className="register-info">
					Registrate a new account on your own. Choose account below
				</p>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: !!ipOrUrl.error })}>
						<label htmlFor="accountName">IP or URL</label>
						<input
							name="IpUrl"
							disabled={loading}
							placeholder="Enter IP or URL"
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

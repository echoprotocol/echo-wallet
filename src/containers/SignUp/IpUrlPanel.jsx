import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

class IpUrlPanel extends React.Component {

	render() {
		const { loading } = this.props;

		return (
			<React.Fragment>
				<p className="register-info">
					Registrate a new account on your own. Choose account below
				</p>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: false })}>
						<label htmlFor="accountName">IP or URL</label>
						<input
							name="IpUrl"
							placeholder="Enter IP or URL"
						/>
						{ false && <span className="error-message">some error</span> }
					</Form.Field>
				</div>
			</React.Fragment>
		);
	}

}

IpUrlPanel.propTypes = {
	loading: PropTypes.bool.isRequired,

};

export default IpUrlPanel;

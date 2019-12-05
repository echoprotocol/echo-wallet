import React from 'react';
// import PropTypes from 'prop-types';
// import { Button } from 'semantic-ui-react';

class DefaultSettingsPanel extends React.Component {

	render() {

		return (
			<React.Fragment>
				<p className="register-info">
					Your account will be registered by public default registrar.
				</p>
			</React.Fragment>
		);
	}

}

DefaultSettingsPanel.propTypes = {};

export default DefaultSettingsPanel;

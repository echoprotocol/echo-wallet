import React from 'react';

class DefaultSettingsPanel extends React.Component {

	render() {

		return (
			<div className="register-info">
				<p>
					Register for free by public registrar.
				</p>
				<p>
					Delegation to participate in the consensus will be granted to public registrar.
				</p>
			</div>
		);
	}

}

DefaultSettingsPanel.propTypes = {};

export default DefaultSettingsPanel;

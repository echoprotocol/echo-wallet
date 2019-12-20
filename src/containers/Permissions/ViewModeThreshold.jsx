import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class ThresholdRow extends React.Component {

	render() {

		const { defaultThreshold } = this.props;

		return (
			<React.Fragment>
				<span className="threshold">
					<FormattedMessage id="backup_and_permissions_page.view_mode.threshold" />
				</span>
				<span className="threshold-value">{defaultThreshold}</span>
			</React.Fragment>
		);
	}

}

ThresholdRow.propTypes = {
	defaultThreshold: PropTypes.number,
};

ThresholdRow.defaultProps = {
	defaultThreshold: '',
};

export default ThresholdRow;

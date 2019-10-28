import React from 'react';
import PropTypes from 'prop-types';

class ThresholdRow extends React.Component {

	render() {

		const { defaultThreshold } = this.props;

		return (
			<React.Fragment>
				<span className="threshold"> threshold </span>
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

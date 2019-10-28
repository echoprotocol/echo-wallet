import React from 'react';
import PropTypes from 'prop-types';
// import { Form } from 'semantic-ui-react';
// import { connect } from 'react-redux';
// import classnames from 'classnames';

// import { setInFormValue } from '../../actions/FormActions';

// import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class ThresholdRow extends React.Component {

	// componentDidUpdate(prevProps) {
	// 	const { keyRole, threshold, defaultThreshold } = this.props;
	// 	const { defaultThreshold: prevDefaultThreshold } = prevProps;

	// 	if (!threshold.value && (!prevDefaultThreshold && defaultThreshold)) {
	// 		this.props.setValue([keyRole, 'threshold'], defaultThreshold);
	// 	}
	// }

	// onInput(e) {
	// 	e.preventDefault();
	// 	const { keyRole } = this.props;

	// 	const field = e.target.name;
	// 	const value = e.target.value.trim();
	// 	this.props.setValue([keyRole, field], value);
	// }

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

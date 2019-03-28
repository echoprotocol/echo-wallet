import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { setInFormValue } from '../../actions/FormActions';

import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class ThresholdRow extends React.Component {

	componentDidUpdate(prevProps) {
		const { keyRole, threshold, defaultThreshold } = this.props;
		const { defaultThreshold: prevDefaultThreshold } = prevProps;

		if (!threshold.value && (!prevDefaultThreshold && defaultThreshold)) {
			this.props.setValue([keyRole, 'threshold'], defaultThreshold);
		}
	}

	onInput(e) {
		e.preventDefault();
		const { keyRole } = this.props;

		const field = e.target.name;
		const value = e.target.value.trim();
		this.props.setValue([keyRole, field], value);
	}

	render() {

		const { threshold, keyRole } = this.props;

		return (
			<Form className="treshhold-input">
				<Form.Field
					className={classnames({ error: threshold.error })}
				>
					<p className="i-title">THRESHOLD</p>
					<input
						type="text"
						placeholder="Enter threshold"
						name="threshold"
						className="ui input"
						value={threshold.value || ''}
						onChange={(e) => this.onInput(e)}
						autoFocus={keyRole === 'active'}
					/>
					<span className="error-message">{threshold.error}</span>
				</Form.Field>
			</Form>
		);
	}

}

ThresholdRow.propTypes = {
	keyRole: PropTypes.string.isRequired,
	threshold: PropTypes.object.isRequired,
	defaultThreshold: PropTypes.number,
	setValue: PropTypes.func.isRequired,
};

ThresholdRow.defaultProps = {
	defaultThreshold: '',
};

export default connect(
	(state, props) => ({
		threshold: state.form.getIn([FORM_PERMISSION_KEY, props.keyRole, 'threshold']),
	}),
	(dispatch) => ({
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
	}),
)(ThresholdRow);

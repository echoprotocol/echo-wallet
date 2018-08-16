import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { setInFormValue } from '../../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';

class InputComponent extends React.Component {

	onChange(e) {
		const { field } = this.props;
		const value = e.target.value.trim();
		if (field) {
			this.props.setInFormValue(field.name, field.id, value);
		}
	}

	render() {
		const {
			inputData, field: currentField, inputs,
		} = this.props;

		const testField = inputs.toJS()[currentField.name][currentField.id].value;

		return (
			<Input
				className="item"
				size="mini"
				value={testField}
				onChange={(e) => this.onChange(e)}
				placeholder={`${inputData.name} (${inputData.type})`}
			/>
		);
	}

}

InputComponent.propTypes = {
	inputData: PropTypes.object.isRequired,
	inputs: PropTypes.object.isRequired,
	field: PropTypes.any.isRequired,
	setInFormValue: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		inputField: state.form.getIn([FORM_VIEW_CONTRACT]),
		inputs: state.form.getIn([FORM_VIEW_CONTRACT, 'inputs']),
	}),
	(dispatch) => ({
		setInFormValue: (field, index, value) => dispatch(setInFormValue(FORM_VIEW_CONTRACT, ['inputs', field, index], value)),
	}),
)(InputComponent);

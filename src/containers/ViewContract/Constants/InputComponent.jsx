import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { setInFormValue } from '../../../actions/FormActions';

import { formatCallContractField } from '../../../helpers/FormatHelper';

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

		const { value } = inputs.toJS()[currentField.name][currentField.id];

		return (
			<Input
				className="item"
				size="mini"
				value={value}
				onChange={(e) => this.onChange(e)}
				placeholder={`${formatCallContractField(inputData.name)}(${inputData.type.replace(/address/g, 'id')})`}
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

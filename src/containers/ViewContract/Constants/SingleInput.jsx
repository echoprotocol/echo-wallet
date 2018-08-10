import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { setFormValue, push } from '../../../actions/FormActions';

class SingleInput extends React.Component {

	// constant: true
	// constantValue: "Example Fixed Supply Token"
	// inputs: []
	// name: "name"
	// outputs: [{…}]
	// payable: false
	// stateMutability: "view"
	// type: "function"

	onChange(e) {
		const field = e.target.name;
		const value = e.target.value.trim();
		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { inputData, inputField, field: currentField } = this.props;

		const newField = inputField.toJS()[`${currentField.name},${currentField.id}`].value;

		return (
			<Input
				className="item"
				size="mini"
				name={`${currentField.name},${currentField.id}`}
				value={newField}
				onChange={(e) => this.onChange(e)}
				placeholder={`${inputData.name} (${inputData.type})`}
			/>
		);
	}

}

SingleInput.propTypes = {
	inputData: PropTypes.object.isRequired,
	inputField: PropTypes.any,
	field: PropTypes.any.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

SingleInput.defaultProps = {
	inputField: null,
};

export default connect(
	(state) => ({
		inputField: state.form.getIn([FORM_VIEW_CONTRACT]),
	}),
	(dispatch) => ({
		push: (field, param) => dispatch(push(FORM_VIEW_CONTRACT, field, param)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_VIEW_CONTRACT, field, value)),
	}),
)(SingleInput);

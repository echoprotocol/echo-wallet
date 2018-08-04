import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

import { setFormValue } from '../../actions/FormActions';

class FormComponent extends React.Component {

	onChange(e, lowerCase) {
		const field = e.target.name;
		let { value } = e.target;

		if (lowerCase) {
			value = value.toLowerCase();
		}

		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { bytecode, name, abi } = this.props;

		return (
			<div className="field-wrap">
				<div className="form-info">
					<h3>Create Smart Contract</h3>
				</div>
				<Form.Field>
					<Form.Field
						label="ByteCode"
						placeholder="Byte Code"
						control="textarea"
						name="bytecode"
						value={bytecode.value}
						onChange={(e) => this.onChange(e, true)}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Field
						label="Name"
						placeholder="Name"
						control="input"
						name="name"
						value={name.value}
						onChange={(e) => this.onChange(e, true)}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Field
						label="Abi"
						placeholder="Abi"
						control="textarea"
						name="abi"
						value={abi.value}
						onChange={(e) => this.onChange(e, true)}
					/>
				</Form.Field>
			</div>
		);
	}

}

FormComponent.propTypes = {
	bytecode: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	abi: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
};
export default connect(
	(state) => ({
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
		name: state.form.getIn([FORM_CREATE_CONTRACT, 'name']),
		abi: state.form.getIn([FORM_CREATE_CONTRACT, 'abi']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
	}),
)(FormComponent);

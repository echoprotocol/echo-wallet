import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';

class FormComponent extends React.Component {

	componentWillMount() {
		this.props.clearForm();
	}

	onChange(e) {
		const field = e.target.name;
		let { value } = e.target;
		value = value.trim();
		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { bytecode } = this.props;
		return (
			<div className="field-wrap">
				<div className="form-info">
					<h3>Create Smart Contract</h3>
				</div>
				<div className="action-wrap error">
					<Form.Field
						label="ByteCode"
						placeholder="Byte Code"
						control="textarea"
						name="bytecode"
						value={bytecode.value}
						onChange={(e) => this.onChange(e)}
					/>
					{bytecode.error && <span className="error-message">{bytecode.error}</span>}

				</div>

			</div>
		);
	}

}

FormComponent.propTypes = {
	bytecode: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
	}),
)(FormComponent);

import React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearForm } from '../../actions/FormActions';

import FormComponent from './FormComponent';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

class CreateContract extends React.Component {

	componentWillUnmount() {
		this.props.clearForm(FORM_CREATE_CONTRACT);
	}

	render() {
		return (
			<Form className="main-form">
				<FormComponent />
			</Form>
		);
	}

}

CreateContract.propTypes = {
	clearForm: PropTypes.func.isRequired,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		clearForm: (value) => dispatch(clearForm(value)),
	}),
)(CreateContract);

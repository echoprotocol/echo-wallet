import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Segment } from 'semantic-ui-react';

import Footer from '../../components/Footer/index';
import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';

import { generatePassword } from '../../actions/AuthActions';

class SignUp extends React.Component {

	componentWillMount() {
		this.props.generatePassword();
	}

	render() {

		return (
			<Segment basic className="wrapper">
				<div className="content center-mode">
					<div>
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<FormComponent />
							<CheckComponent />
							<ButtonComponent />
							<span className="sign-nav">
								Have an account?
								<Link className="link orange" to={SIGN_IN_PATH}> Login</Link>
							</span>
						</Form>
					</div>
				</div>
				<Footer />
			</Segment>
		);
	}

}

SignUp.propTypes = {
	generatePassword: PropTypes.func.isRequired,
};


export default connect(
	() => ({}),
	(dispatch) => ({
		generatePassword: () => dispatch(generatePassword()),
	}),
)(SignUp);

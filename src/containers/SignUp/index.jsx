import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';

import { generatePassword } from '../../actions/AuthActions';

class SignUp extends React.Component {

	componentDidMount() {
		this.props.generatePassword();
	}
	renderAddAccount() {
		return (
			<Form className="main-form">
				<div className="form-info">
					<a href="#" className="back-link">
						<span className="icon-back" />
                        back
					</a>
					<h3>Add Account</h3>
				</div>
				<FormComponent />
				<CheckComponent />
				<ButtonComponent btnContent="Add Account" />
				<span className="sign-nav">
                    Have an account?
					<Link className="link orange" to={SIGN_IN_PATH}>Login</Link>
				</span>
			</Form>
		);
	}

	renderSignUp() {
		return (

			<Form className="main-form">
				<div className="form-info">
					<h3>Welcome to Echo</h3>
				</div>
				<FormComponent />
				<CheckComponent />
				<ButtonComponent btnContent="Create Account" />
				<span className="sign-nav">
                    Have an account?
					<Link className="link orange" to={SIGN_IN_PATH}>Login</Link>
				</span>
			</Form>
		);
	}
	render() {

		return (
			<div className="sign-scroll-fix">
				{ this.renderAddAccount()}
				{/* { this.renderSignUp() } */}
			</div>
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

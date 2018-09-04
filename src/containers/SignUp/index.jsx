import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';

import { cancelAddAccount, generatePassword } from '../../actions/AuthActions';
import { FORM_SIGN_UP } from '../../constants/FormConstants';

class SignUp extends React.Component {

	componentDidMount() {
		this.props.generatePassword();
	}

	onCancel() {
		this.props.cancelAddAccount();
	}

	renderSignUp() {
		const { isAddAccount, loading } = this.props;
		return (
			<Form className="main-form">
				{
					isAddAccount ?
						<div className="form-info">
							<button className="back-link" onClick={(e) => this.onCancel(e)} disabled={loading}>
								<span className="icon-back" />
								back
							</button>
							<h3>Add Account</h3>
						</div> :
						<div className="form-info">
							<h3>Welcome to Echo</h3>
						</div>
				}
				<FormComponent />
				<CheckComponent />
				<ButtonComponent btnContent={isAddAccount ? 'Add Account' : 'Create Account'} />
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
				{ this.renderSignUp() }
			</div>
		);
	}

}

SignUp.propTypes = {
	generatePassword: PropTypes.func.isRequired,
	isAddAccount: PropTypes.bool.isRequired,
	cancelAddAccount: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

SignUp.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		isAddAccount: state.global.get('isAddAccount'),
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		generatePassword: () => dispatch(generatePassword()),
		cancelAddAccount: () => dispatch(cancelAddAccount()),
	}),
)(SignUp);

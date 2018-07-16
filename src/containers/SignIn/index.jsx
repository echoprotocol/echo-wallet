import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, Segment } from 'semantic-ui-react';
import Footer from '../../components/Footer/index';

import { authUser } from '../../actions/AuthActions';
import { FORM_SIGN_IN } from '../../constants/FormConstants';

import { setFormValue } from '../../actions/FormActions';

class SignIn extends React.Component {

	onClick() {

		this.props.authUser();
		const { accountName, password } = this.props;

		this.props.authUser({
			accountName: accountName.value,
			confirmPassword: password.value,
		});
	}

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
		const { accountName, password } = this.props;

		return (
			<Segment basic className="wrapper">
				<div className="content center-mode ">
					<div>
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="AccountName">Account name</label>
									<input id="AccountName" placeholder="Account name" name="accountName" className="ui input" value={accountName.value} onChange={(e) => this.onChange(e, true)} />
								</Form.Field>
								<Form.Field>
									<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
									<input placeholder="Password or WIF-key" name="confirmPassword" className="ui input" value={password.value} onChange={(e) => this.onChange(e)} />
								</Form.Field>
							</div>
							{/* <Button basic type="submit" color="orange">Log In</Button> */}
							<Button type="submit" color="orange" className="load" onSubmit={(e) => this.onClick(e)}>Loading...</Button>
							<span className="sign-nav">
								Don’t have an account?
								<Link className="link orange" to="/sign-up"> Sign Up</Link>
							</span>
						</Form>
					</div>
				</div>
				<Footer />
			</Segment>
		);
	}

}

SignIn.propTypes = {
	accountName: PropTypes.object.isRequired,
	password: PropTypes.object.isRequired,
	authUser: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_IN, 'accountName']),
		password: state.form.getIn([FORM_SIGN_IN, 'password']),
	}),
	(dispatch) => ({
		authUser: () => dispatch(authUser()),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_IN, field, value)),
	}),
)(SignIn);

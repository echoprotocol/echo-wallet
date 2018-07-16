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

		const { accountName, password } = this.props;

		this.props.authUser({
			accountName: accountName.value,
			password: password.value,
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
		const { accountName, password, loading } = this.props;

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
									<div className={accountName.error ? 'error' : ''}>
										<input placeholder="Account name" name="accountName" className="ui input" value={accountName.value} onChange={(e) => this.onChange(e, true)} />
										<span className="error-message">{accountName.error}</span>
									</div>
								</Form.Field>
								<Form.Field>
									<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
									<div className={password.error ? 'error' : ''}>
										<input placeholder="Password or WIF-key" name="password" className="ui input" value={password.value} onChange={(e) => this.onChange(e)} />
										<span className="error-message">{password.error}</span>
									</div>
								</Form.Field>
							</div>
							{loading
								? <Button type="submit" color="orange" className="load" onSubmit={(e) => this.onClick(e)}>Loading...</Button>
								: <Button basic type="submit" color="orange" onClick={(e) => this.onClick(e)}>Log In</Button>}
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
	loading: PropTypes.bool,
};

SignIn.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_IN, 'accountName']),
		password: state.form.getIn([FORM_SIGN_IN, 'password']),
		loading: state.form.getIn([FORM_SIGN_IN, 'loading']),
	}),
	(dispatch) => ({
		authUser: (value) => dispatch(authUser(value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_IN, field, value)),
	}),
)(SignIn);

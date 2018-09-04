import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_SIGN_IN } from '../../constants/FormConstants';

import { authUser, cancelAddAccount } from '../../actions/AuthActions';
import { setFormValue, clearForm } from '../../actions/FormActions';

class SignIn extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onClick() {
		const { accountName, password } = this.props;

		this.props.authUser({
			accountName: accountName.value.trim(),
			password: password.value.trim(),
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

	onCancel() {
		this.props.cancelAddAccount();
	}

	isDisabledSubmit() {
		const { accountName, password } = this.props;

		if ((!accountName.value || accountName.error) || (!password.value || password.error)) {
			return true;
		}

		return false;
	}

	renderSignIn() {
		const {
			accountName, password, loading, isAddAccount,
		} = this.props;
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
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: accountName.error })}>
						<label htmlFor="AccountName">Account name</label>

						<input placeholder="Account name" name="accountName" className="ui input" value={accountName.value} onChange={(e) => this.onChange(e, true)} />
						<span className="error-message">{accountName.error}</span>

					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: password.error })}>
						<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
						<input type="password" placeholder="Password or WIF-key" name="password" className="ui input" value={password.value} onChange={(e) => this.onChange(e)} />
						<span className="error-message">{password.error}</span>
					</Form.Field>
				</div>
				{
					loading ?
						<Button type="submit" color="orange" className="load" onSubmit={(e) => this.onClick(e)}>Loading...</Button> :
						<Button
							basic
							type="submit"
							color="orange"
							disabled={this.isDisabledSubmit()}
							onClick={(e) => this.onClick(e)}
							className={classnames({ disabled: this.isDisabledSubmit() })}
						>
							{isAddAccount ? 'Add Account' : 'Login'}
						</Button>
				}
				<span className="sign-nav">
                Don’t have an account?
					<Link className="link orange" to="/sign-up">Sign Up</Link>
				</span>
			</Form>
		);
	}

	render() {

		return (
			<div className="sign-scroll-fix">
				{ this.renderSignIn() }
			</div>
		);
	}

}

SignIn.propTypes = {
	accountName: PropTypes.object.isRequired,
	password: PropTypes.object.isRequired,
	authUser: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	cancelAddAccount: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	isAddAccount: PropTypes.bool.isRequired,
};

SignIn.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_IN, 'accountName']),
		password: state.form.getIn([FORM_SIGN_IN, 'password']),
		loading: state.form.getIn([FORM_SIGN_IN, 'loading']),
		isAddAccount: state.global.get('isAddAccount'),
	}),
	(dispatch) => ({
		authUser: (value) => dispatch(authUser(value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_IN, field, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_IN)),
		cancelAddAccount: () => dispatch(cancelAddAccount()),
	}),
)(SignIn);

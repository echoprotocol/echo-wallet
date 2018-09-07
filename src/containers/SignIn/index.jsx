import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';

import { SIGN_UP_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_IN } from '../../constants/FormConstants';

import { authUser } from '../../actions/AuthActions';
import { setFormValue, clearForm } from '../../actions/FormActions';


import { toastSuccess, toastInfo } from '../../helpers/ToastHelper';

class SignIn extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onClick(isAddAccount) {
		const { accountName, password } = this.props;

		this.props.authUser({
			accountName: accountName.value.trim(),
			password: password.value.trim(),
		}, isAddAccount);
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
		this.props.history.goBack();
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
			accountName, password, loading, location,
		} = this.props;

		const isAddAccount = location.state ? location.state.isAddAccount : false;

		return (

			<Form className="main-form">
				<div className="form-info">
					{ isAddAccount ?
						<button className="back-link" onClick={(e) => this.onCancel(e)} disabled={loading}>
							<span className="icon-back" />
							back
						</button> : null
					}
					<h3>{isAddAccount ? 'Add Account' : 'Welcome to Echo'}</h3>
				</div>
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
						<Button
							type="submit"
							color="orange"
							className="load main-btn"
							content="Loading..."
						/> :
						<Button
							basic
							type="submit"
							disabled={this.isDisabledSubmit()}
							onClick={(e) => this.onClick(isAddAccount, e)}
							className={classnames('main-btn', { disabled: this.isDisabledSubmit() })}
							content={isAddAccount ? 'Add Account' : 'Login'}
						/>
				}
				<span className="sign-nav">
                Don’t have an account?
					<Link className="link main-link" to={{ pathname: SIGN_UP_PATH, state: { isAddAccount } }}>Sign Up</Link>
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
	loading: PropTypes.bool,
	accountName: PropTypes.object.isRequired,
	password: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	authUser: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
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
		authUser: (value, isAdd) => dispatch(authUser(value, isAdd)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_IN, field, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_IN)),
	}),
)(SignIn);

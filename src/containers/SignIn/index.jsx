import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';

import AuthorizationScenario from '../AuthorizationScenario';

import { SIGN_UP_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_IN } from '../../constants/FormConstants';

import { importAccount } from '../../actions/AuthActions';
import { setFormValue, clearForm } from '../../actions/FormActions';

class SignIn extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onClick(password) {
		const { accountName, wif } = this.props;
		this.props.importAccount({
			accountName: accountName.value.trim(),
			wif: wif.value.trim(),
			password,
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
		this.props.history.goBack();
	}

	isDisabledSubmit() {
		const {
			wif,
		} = this.props;

		if (!wif.value || wif.error) {
			return true;
		}

		return false;
	}

	renderSignIn(submit) {
		const {
			accountName, wif, loading, location,
		} = this.props;

		const { isAddAccount } = qs.parse(location.search);


		return (

			<Form className="main-form">
				<div className="form-info">
					{isAddAccount ?
						<button
							type="button"
							className="back-link"
							onClick={() => this.onCancel()}
							disabled={loading}
						>
							<span className="icon-back" />
							back
						</button> : null
					}
					<h3>{isAddAccount ? 'Add Account' : 'Welcome to Echo'}</h3>
				</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: accountName.error })}>
						<label htmlFor="AccountName">Account name</label>

						<input
							placeholder="Account Name"
							name="accountName"
							className="ui input"
							value={accountName.value}
							onChange={(e) => this.onChange(e, true)}
							autoFocus
						/>
						<span className="error-message">{accountName.error}</span>

					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: wif.error })}>
						<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
						<input type="password" placeholder="Password or WIF-key" name="wif" className="ui input" value={wif.value} onChange={(e) => this.onChange(e)} />
						<span className="error-message">{wif.error}</span>
					</Form.Field>
				</div>
				<div className="form-panel">
					<span className="sign-nav">
						Don’t have an account?
						<Link
							className={classnames('link', 'main-link', { disabled: loading })}
							to={`${SIGN_UP_PATH}${isAddAccount ? '?isAddAccount=true' : ''}`}
						>Sign Up
						</Link>
					</span>
					{
						loading ?
							<Button
								type="submit"
								color="orange"
								className="load main-btn fix-width"
								content="Loading..."
							/> :
							<Button
								basic
								type="submit"
								disabled={this.isDisabledSubmit()}
								onClick={submit}
								className={classnames('main-btn fix-width', { disabled: this.isDisabledSubmit() })}
								content={isAddAccount ? 'Add Account' : 'Login'}
							/>
					}

				</div>
			</Form>
		);
	}

	render() {

		return (
			<AuthorizationScenario authorize={(password) => this.onClick(password)}>
				{
					(submit) => (
						<div className="sign-scroll-fix">
							{this.renderSignIn(submit)}
						</div>
					)
				}
			</AuthorizationScenario>
		);
	}

}

SignIn.propTypes = {
	loading: PropTypes.bool,
	accountName: PropTypes.object.isRequired,
	wif: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	importAccount: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

SignIn.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_IN, 'accountName']),
		wif: state.form.getIn([FORM_SIGN_IN, 'wif']),
		loading: state.form.getIn([FORM_SIGN_IN, 'loading']),
	}),
	(dispatch) => ({
		importAccount: (value) => dispatch(importAccount(value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_IN, field, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_IN)),
	}),
)(SignIn);

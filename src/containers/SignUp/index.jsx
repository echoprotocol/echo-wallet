import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';
import { PrivateKey } from 'echojs-lib';

import AuthorizationScenario from '../AuthorizationScenario';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';
import AdditionalOptions from './AdditionalOptions';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_UP } from '../../constants/FormConstants';

import { generateWIF, createAccount } from '../../actions/AuthActions';
import { setFormValue, setValue, clearForm, setFormError } from '../../actions/FormActions';

class SignUp extends React.Component {

	componentDidMount() {
		this.props.generateWIF();
	}

	onCancel() {
		this.props.history.goBack();
	}

	onCreate(password) {
		const {
			accountName, generatedWIF, confirmWIF, isAddAccount, isCustomWIF, userWIF,
		} = this.props;
		this.props.createAccount({
			accountName: accountName.value.trim(),
			generatedWIF: isCustomWIF ? userWIF.value.trim() : generatedWIF.value.trim(),
			confirmWIF: isCustomWIF ? userWIF.value.trim() : confirmWIF.value.trim(),
			password,
		}, isAddAccount, isCustomWIF);

	}

	isDisabledSubmit() {
		const {
			accepted,
			accountName,
			generatedWIF,
			confirmWIF,
			userPublicKey,
			userWIF,
			isCustomWIF,
		} = this.props;

		if (isCustomWIF) {
			if ((!accountName.value || accountName.error) ||
				userPublicKey.error || userWIF.error ||
				!(userPublicKey.value || userWIF.value) || !accepted) {
				return true;
			}
			return false;
		}
		if ((!accountName.value || accountName.error) ||
			(!generatedWIF.value || generatedWIF.error) ||
			(!confirmWIF.value || confirmWIF.error) || !accepted) {
			return true;
		}

		return false;
	}

	render() {
		const { location, loading } = this.props;

		const { isAddAccount } = qs.parse(location.search);

		return (
			<AuthorizationScenario authorize={(password) => this.onCreate(password)}>
				{
					(submit) => (
						<div className="sign-scroll">
							<Form className="main-form sign-up">
								{
									isAddAccount ?
										<div className="form-info">
											<button
												type="button"
												className="back-link"
												onClick={(e) => this.onCancel(e)}
												disabled={loading}
											>
												<span className="icon-back" />
												back
											</button>
											<h3>Add Account</h3>
										</div> :
										<div className="form-info">
											<h3>Welcome to Echo</h3>
										</div>
								}
								<FormComponent
									loading={loading}
									accountName={this.props.accountName}
									generatedWIF={this.props.generatedWIF}
									confirmWIF={this.props.confirmWIF}
									setValue={this.props.setValue}
									setFormValue={this.props.setFormValue}
									setFormError={this.props.setFormError}
									clearForm={this.props.clearForm}
									isCustomWIF={this.props.isCustomWIF}
									userPublicKey={this.props.userPublicKey}
									userWIF={this.props.userWIF}
								/>

								<AdditionalOptions loading={loading} />

								<CheckComponent
									loading={loading}
									setValue={this.props.setValue}
								/>
								<div className="form-panel">
									<span className="sign-nav">
										Have an account?
										<Link
											className={classnames('link', 'orange', { disabled: loading })}
											to={`${SIGN_IN_PATH}${isAddAccount ? '?isAddAccount=true' : ''}`}
										>Login
										</Link>
									</span>
									<ButtonComponent
										loading={loading}
										isAddAccount={isAddAccount}
										disabled={this.isDisabledSubmit()}
										submit={submit}
									/>
								</div>
							</Form>
						</div>
					)
				}
			</AuthorizationScenario>
		);
	}

}

SignUp.propTypes = {
	loading: PropTypes.bool,
	isCustomWIF: PropTypes.bool,
	accepted: PropTypes.bool,
	isAddAccount: PropTypes.any,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	accountName: PropTypes.object.isRequired,
	generatedWIF: PropTypes.object.isRequired,
	confirmWIF: PropTypes.object.isRequired,
	userPublicKey: PropTypes.object.isRequired,
	userWIF: PropTypes.object.isRequired,
	generateWIF: PropTypes.func.isRequired,
	createAccount: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
	loading: false,
	accepted: false,
	isAddAccount: false,
	isCustomWIF: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
		isCustomWIF: state.form.getIn([FORM_SIGN_UP, 'isCustomWIF']),
		accepted: state.form.getIn([FORM_SIGN_UP, 'accepted']),
		accountName: state.form.getIn([FORM_SIGN_UP, 'accountName']),
		generatedWIF: state.form.getIn([FORM_SIGN_UP, 'generatedWIF']),
		confirmWIF: state.form.getIn([FORM_SIGN_UP, 'confirmWIF']),
		userPublicKey: state.form.getIn([FORM_SIGN_UP, 'userPublicKey']),
		userWIF: state.form.getIn([FORM_SIGN_UP, 'userWIF']),
	}),
	(dispatch) => ({
		generateWIF: () => dispatch(generateWIF()),
		createAccount: (value, isAdd, isCustom) => dispatch(createAccount(value, isAdd, isCustom)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_UP, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_SIGN_UP, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_SIGN_UP, field, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_UP)),
	}),
)(SignUp);

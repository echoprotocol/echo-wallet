import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';

import AuthorizationScenario from '../AuthorizationScenario';
import TransactionScenario from '../TransactionScenario';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';
import AdditionalOptions from './AdditionalOptions';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_UP, FORM_SIGN_UP_OPTIONS, SIGN_UP_OPTIONS_TYPES } from '../../constants/FormConstants';

import { generateWIF, createAccount } from '../../actions/AuthActions';
import { setFormValue, setValue, clearForm } from '../../actions/FormActions';

class SignUp extends React.Component {

	componentDidMount() {
		this.props.generateWIF();
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_SIGN_UP_OPTIONS);
	}

	onCancel() {
		this.props.history.goBack();
	}

	onCreate(password) {
		const {
			accountName, generatedWIF, confirmWIF, isAddAccount,
		} = this.props;

		this.props.createAccount({
			accountName: accountName.value.trim(),
			generatedWIF: generatedWIF.value.trim(),
			confirmWIF: confirmWIF.value.trim(),
			password,
		}, isAddAccount);
	}

	isDisabledSubmit() {
		const {
			accepted,
			accountName,
			generatedWIF,
			confirmWIF,
		} = this.props;

		if ((!accountName.value || accountName.error) ||
			(!generatedWIF.value || generatedWIF.error) ||
			(!confirmWIF.value || confirmWIF.error) || !accepted) {
			return true;
		}

		return false;
	}

	render() {
		const {
			location, loading, signupOptionsForm, accounts,
		} = this.props;

		const { isAddAccount } = qs.parse(location.search);

		const check = signupOptionsForm.get('optionType');

		return (
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
						setFormValue={this.props.setFormValue(FORM_SIGN_UP)}
						clearForm={() => this.props.clearForm(FORM_SIGN_UP)}
					/>

					<AdditionalOptions
						loading={loading}
						signupOptionsForm={signupOptionsForm}
						setFormValue={this.props.setFormValue(FORM_SIGN_UP_OPTIONS)}
						setValue={this.props.setValue(FORM_SIGN_UP_OPTIONS)}
						accounts={accounts}
					/>

					<CheckComponent
						loading={loading}
						setValue={this.props.setValue(FORM_SIGN_UP)}
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
						{
							check === SIGN_UP_OPTIONS_TYPES.PARENT ? (
								<TransactionScenario handleTransaction={(password) => this.onCreate(password)}>
									{
										(submit) => (
											<ButtonComponent
												loading={loading}
												isAddAccount={isAddAccount}
												disabled={this.isDisabledSubmit()}
												submit={submit}
											/>
										)
									}
								</TransactionScenario>
							) : (
								<AuthorizationScenario authorize={(password) => this.onCreate(password)}>
									{
										(submit) => (
											<ButtonComponent
												loading={loading}
												isAddAccount={isAddAccount}
												disabled={this.isDisabledSubmit()}
												submit={submit}
											/>
										)
									}
								</AuthorizationScenario>
							)
						}
					</div>
				</Form>
			</div>
		);
	}

}

SignUp.propTypes = {
	loading: PropTypes.bool,
	accepted: PropTypes.bool,
	isAddAccount: PropTypes.any,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	accountName: PropTypes.object.isRequired,
	generatedWIF: PropTypes.object.isRequired,
	confirmWIF: PropTypes.object.isRequired,
	generateWIF: PropTypes.func.isRequired,
	createAccount: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
};

SignUp.defaultProps = {
	loading: false,
	accepted: false,
	isAddAccount: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
		accepted: state.form.getIn([FORM_SIGN_UP, 'accepted']),
		accountName: state.form.getIn([FORM_SIGN_UP, 'accountName']),
		generatedWIF: state.form.getIn([FORM_SIGN_UP, 'generatedWIF']),
		confirmWIF: state.form.getIn([FORM_SIGN_UP, 'confirmWIF']),
		signupOptionsForm: state.form.get(FORM_SIGN_UP_OPTIONS),
		accounts: state.balance.get('preview').toJS(),
	}),
	(dispatch) => ({
		generateWIF: () => dispatch(generateWIF()),
		createAccount: (value, isAdd) => dispatch(createAccount(value, isAdd)),
		setFormValue: (form) => (field, value) => dispatch(setFormValue(form, field, value)),
		setValue: (form) => (field, value) => dispatch(setValue(form, field, value)),
		clearForm: (form) => dispatch(clearForm(form)),
	}),
)(SignUp);

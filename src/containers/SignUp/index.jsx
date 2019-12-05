import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';
import _ from 'lodash';

import AuthorizationScenario from '../AuthorizationScenario';
import TransactionScenario from '../TransactionScenario';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';
import AdditionalOptions from './AdditionalOptions';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_UP, FORM_SIGN_UP_OPTIONS, SIGN_UP_OPTIONS_TYPES } from '../../constants/FormConstants';

import {
	generateWIF,
	createAccount,
	validateCreateAccount,
	saveWIFAfterCreateAccount,
} from '../../actions/AuthActions';
import { setFormValue, setValue, clearForm } from '../../actions/FormActions';
import { createAccountTransaction } from '../../actions/TransactionActions';

class SignUp extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: null,
			publicKey: null,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentDidMount() {
		this.props.generateWIF();
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_SIGN_UP_OPTIONS);
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	onCancel() {
		this.props.history.goBack();
	}

	onUnlock(password) {
		this.setState({ password });
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

	async validateCreateAccount() {
		const {
			accountName, generatedWIF, confirmWIF, isAddAccount,
		} = this.props;

		const publicKey = await this.props.validateCreateAccount({
			accountName: accountName.value.trim(),
			generatedWIF: generatedWIF.value.trim(),
			confirmWIF: confirmWIF.value.trim(),
		}, isAddAccount);

		if (!publicKey) {
			return null;
		}
		this.setState({ publicKey });
		return this.createAccountTransactions(publicKey);
	}

	saveWIFAfterCreateAccount() {
		const { accountName, generatedWIF } = this.props;
		const { publicKey, password } = this.state;

		this.props.saveWIFAfterCreateAccount({
			accountName: accountName.value.trim(),
			generatedWIF: generatedWIF.value.trim(),
			publicKey,
			password,
		});
	}

	createAccountTransactions(publicKey) {
		const { signupOptionsForm, accountName } = this.props;
		const name = accountName.value.trim();
		const senderName = signupOptionsForm.get('registrarAccount').value;

		return this.props.createAccountTransaction(senderName, { name, publicKey });
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

	isDisabledSubmitParent() {
		const {
			accepted,
			accountName,
			generatedWIF,
			confirmWIF,
			accounts,
			signupOptionsForm,
		} = this.props;

		if ((!accountName.value || accountName.error) ||
			(!generatedWIF.value || generatedWIF.error) ||
			(!confirmWIF.value || confirmWIF.error) ||
			(!accounts.length) ||
			(!signupOptionsForm.get('registrarAccount').value) ||
			!accepted) {
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
								<TransactionScenario
									handleTransaction={() => this.validateCreateAccount()}
									onUnlock={(password) => this.onUnlock(password)}
									onSuccess={() => this.saveWIFAfterCreateAccount()}
								>
									{
										(submit) => (
											<ButtonComponent
												loading={loading}
												isAddAccount={isAddAccount}
												disabled={this.isDisabledSubmitParent()}
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
	validateCreateAccount: PropTypes.func.isRequired,
	saveWIFAfterCreateAccount: PropTypes.func.isRequired,
	createAccountTransaction: PropTypes.func.isRequired,
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
		createAccountTransaction: (sender, value) => dispatch(createAccountTransaction(sender, value)),
		validateCreateAccount: (value, isAdd) => dispatch(validateCreateAccount(value, isAdd)),
		saveWIFAfterCreateAccount: (value) => dispatch(saveWIFAfterCreateAccount(value)),
		setFormValue: (form) => (field, value) => dispatch(setFormValue(form, field, value)),
		setValue: (form) => (field, value) => dispatch(setValue(form, field, value)),
		clearForm: (form) => dispatch(clearForm(form)),
	}),
)(SignUp);

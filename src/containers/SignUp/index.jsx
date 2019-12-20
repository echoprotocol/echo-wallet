import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';

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
	checkParentKeys,
	validateAndSetIpOrUrl,
} from '../../actions/AuthActions';
import { setFormValue, setValue, clearForm, setFormError } from '../../actions/FormActions';
import { createAccountTransaction } from '../../actions/TransactionActions';
import {
	getRemoteAddressesForRegistration,
	saveRemoteAddressForRegistration,
} from '../../actions/GlobalActions';

class SignUp extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: null,
			publicKey: null,
			isWithoutWIFRegistr: null,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentDidMount() {
		this.props.generateWIF();
		this.props.getRemoteAddresses();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.signupOptionsForm.get('registrarAccount').value !==
			this.props.signupOptionsForm.get('registrarAccount').value) {
			this.props.checkParentKeys(this.props.signupOptionsForm.get('registrarAccount').value);
		}
	}
	componentWillUnmount() {
		this.props.clearForm(FORM_SIGN_UP);
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
			accountName, generatedWIF, confirmWIF, isAddAccount, isCustomWIF, userWIF,
		} = this.props;
		this.props.createAccount({
			accountName: accountName.value.trim(),
			generatedWIF: isCustomWIF ? userWIF.value.trim() : generatedWIF.value.trim(),
			confirmWIF: isCustomWIF ? userWIF.value.trim() : confirmWIF.value.trim(),
			password,
		}, isAddAccount, isCustomWIF);

	}

	async validateCreateAccount() {
		const {
			accountName, generatedWIF, confirmWIF, isAddAccount, isCustomWIF, userWIF,
		} = this.props;

		const result = await this.props.validateCreateAccount({
			accountName: accountName.value.trim(),
			generatedWIF: isCustomWIF ? userWIF.value.trim() : generatedWIF.value.trim(),
			confirmWIF: isCustomWIF ? userWIF.value.trim() : confirmWIF.value.trim(),
		}, isAddAccount, isCustomWIF);

		if (!result) {
			return null;
		}

		const { publicKey, isWithoutWIFRegistr } = result;
		this.setState({ publicKey, isWithoutWIFRegistr });
		return this.createAccountTransactions(publicKey);
	}

	saveWIFAfterCreateAccount() {
		const {
			accountName, generatedWIF, isCustomWIF, userWIF,
		} = this.props;
		const { publicKey, password, isWithoutWIFRegistr } = this.state;

		this.props.saveWIFAfterCreateAccount({
			accountName: accountName.value.trim(),
			generatedWIF: isCustomWIF ? userWIF.value.trim() : generatedWIF.value.trim(),
			publicKey,
			password,
			isWithoutWIFRegistr,
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

	isDisabledSubmitParent() {
		const {
			accounts,
			signupOptionsForm,
		} = this.props;
		const accountName = signupOptionsForm.get('registrarAccount').value;

		if (this.isDisabledSubmit() ||
			(!accounts.length) ||
			(!accountName)) {
			return true;
		}

		return false;
	}

	hideSaveAddressTooltip() {
		const set = this.props.setValue(FORM_SIGN_UP_OPTIONS);
		set('showSaveAddressTooltip', false);
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
									<FormattedMessage id="sign_page.back_button_text" />
								</button>
								<h3><FormattedMessage id="sign_page.title" /></h3>
							</div> :
							<div className="form-info">
								<h3><FormattedMessage id="sign_page.welcome_title" /></h3>
							</div>
					}
					<FormComponent
						loading={loading}
						accountName={this.props.accountName}
						generatedWIF={this.props.generatedWIF}
						confirmWIF={this.props.confirmWIF}
						setFormValue={this.props.setFormValue(FORM_SIGN_UP)}
						setValue={this.props.setValue(FORM_SIGN_UP)}
						setFormError={this.props.setFormError}
						clearForm={this.props.clearForm}
						isCustomWIF={this.props.isCustomWIF}
						userPublicKey={this.props.userPublicKey}
						userWIF={this.props.userWIF}
					/>

					<AdditionalOptions
						loading={loading}
						signupOptionsForm={signupOptionsForm}
						setFormValue={this.props.setFormValue(FORM_SIGN_UP_OPTIONS)}
						setValue={this.props.setValue(FORM_SIGN_UP_OPTIONS)}
						saveRemoteAddress={this.props.saveRemoteAddress}
						remoteRegistrationAddresses={this.props.remoteRegistrationAddresses}
						hideSaveAddressTooltip={() => this.hideSaveAddressTooltip()}
						validateAndSetIpOrUrl={this.props.validateAndSetIpOrUrl}
						accounts={accounts}
					/>

					<CheckComponent
						loading={loading}
						setValue={this.props.setValue(FORM_SIGN_UP)}
					/>
					<div className="form-panel">
						<span className="sign-nav">
							<FormattedMessage id="sign_page.register_account_page.have_acc_text" />
							<Link
								className={classnames('link', 'orange', { disabled: loading })}
								to={`${SIGN_IN_PATH}${isAddAccount ? '?isAddAccount=true' : ''}`}
							>
								<FormattedMessage id="sign_page.register_account_page.have_acc_link" />
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
												disabled={this.isDisabledSubmitParent() || signupOptionsForm.get('registrarAccountKeyWarn').value}
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
	validateCreateAccount: PropTypes.func.isRequired,
	saveWIFAfterCreateAccount: PropTypes.func.isRequired,
	createAccountTransaction: PropTypes.func.isRequired,
	checkParentKeys: PropTypes.func.isRequired,
	getRemoteAddresses: PropTypes.func.isRequired,
	saveRemoteAddress: PropTypes.func.isRequired,
	validateAndSetIpOrUrl: PropTypes.func.isRequired,
	signupOptionsForm: PropTypes.object.isRequired,
	remoteRegistrationAddresses: PropTypes.object.isRequired,
	accounts: PropTypes.array.isRequired,
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
		signupOptionsForm: state.form.get(FORM_SIGN_UP_OPTIONS),
		accounts: state.balance.get('preview').toJS(),
		userPublicKey: state.form.getIn([FORM_SIGN_UP, 'userPublicKey']),
		remoteRegistrationAddresses: state.global.get('remoteRegistrationAddresses'),
		userWIF: state.form.getIn([FORM_SIGN_UP, 'userWIF']),
	}),
	(dispatch) => ({
		generateWIF: () => dispatch(generateWIF()),
		createAccount: (value, isAdd, isCustomWIF) =>
			dispatch(createAccount(value, isAdd, isCustomWIF)),
		createAccountTransaction: (sender, value) => dispatch(createAccountTransaction(sender, value)),
		validateCreateAccount: (value, isAdd, isCustomWIF) =>
			dispatch(validateCreateAccount(value, isAdd, isCustomWIF)),
		saveWIFAfterCreateAccount: (value) => dispatch(saveWIFAfterCreateAccount(value)),
		getRemoteAddresses: () => dispatch(getRemoteAddressesForRegistration()),
		saveRemoteAddress: () => dispatch(saveRemoteAddressForRegistration()),
		setFormValue: (form) => (field, value) => dispatch(setFormValue(form, field, value)),
		setValue: (form) => (field, value) => dispatch(setValue(form, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_SIGN_UP, field, value)),
		validateAndSetIpOrUrl: (value) => dispatch(validateAndSetIpOrUrl(value)),
		clearForm: (form) => dispatch(clearForm(form)),
		checkParentKeys: (accName) => dispatch(checkParentKeys(accName)),
	}),
)(SignUp);

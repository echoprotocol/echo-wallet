import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';
import { FormattedMessage, injectIntl } from 'react-intl';

import AuthorizationScenario from '../AuthorizationScenario';

import { SIGN_UP_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_IN } from '../../constants/FormConstants';

import { importAccount } from '../../actions/AuthActions';
import { setFormValue, clearForm } from '../../actions/FormActions';
import PasswordInput from '../../components/PasswordInput';

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
			accountName, wif, loading, location, intl,
		} = this.props;

		const { isAddAccount } = qs.parse(location.search);
		const accPlaceholder = intl.formatMessage({ id: 'sign_page.import_account_page.name_input.placeholder' });
		const WIFPlaceholder = intl.formatMessage({ id: 'sign_page.import_account_page.wif_input.placeholder' });
		const WIFTtitle = intl.formatMessage({ id: 'sign_page.import_account_page.wif_input.title' });
		const addMsg = intl.formatMessage({ id: 'sign_page.add_account_button' });
		const loginMsg = intl.formatMessage({ id: 'sign_page.login_button' });
		const loadingMsg = intl.formatMessage({ id: 'sign_page.account_button_loading' });

		return (

			<Form className="main-form">
				<div className="form-info">
					{ isAddAccount ?
						<button
							type="button"
							className="back-link"
							onClick={() => this.onCancel()}
							disabled={loading}
						>
							<span className="icon-back" />
							<FormattedMessage id="sign_page.back_button_text" />
						</button> : null
					}
					<h3>{isAddAccount ? 'Add Account' : 'Welcome to Echo'}</h3>
				</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: accountName.error })}>
						<label htmlFor="AccountName">
							<FormattedMessage id="sign_page.import_account_page.name_input.title" />
						</label>
						<input
							placeholder={accPlaceholder}
							name="accountName"
							value={accountName.value}
							onChange={(e) => this.onChange(e, true)}
							autoFocus
						/>
						{
							accountName.error &&
								<span className="error-message">{accountName.error}</span>
						}

					</Form.Field>
					<PasswordInput
						inputLabel={WIFTtitle}
						inputPlaceholder={WIFPlaceholder}
						inputName="wif"
						errorMessage={wif.error}
						onChange={(e) => this.onChange(e)}
						value={wif.value}
					/>
				</div>
				<div className="form-panel">
					<span className="sign-nav">
						<FormattedMessage id="sign_page.import_account_page.dont_have_acc_text" />
						<Link
							className={classnames('link', 'main-link', { disabled: loading })}
							to={`${SIGN_UP_PATH}${isAddAccount ? '?isAddAccount=true' : ''}`}
						>
							<FormattedMessage id="sign_page.import_account_page.dont_have_acc_link" />
						</Link>
					</span>
					{
						loading ?
							<Button
								type="submit"
								className="load main-btn"
								content={loadingMsg}
							/> :
							<Button
								basic
								type="submit"
								disabled={this.isDisabledSubmit()}
								onClick={submit}
								className={classnames('main-btn', { disabled: this.isDisabledSubmit() })}
								content={isAddAccount ? addMsg : loginMsg}
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
						<div className="sign-scroll">
							{ this.renderSignIn(submit) }
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
	intl: PropTypes.any.isRequired,
};

SignIn.defaultProps = {
	loading: false,
};

export default injectIntl(connect(
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
)(SignIn));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

import { FORM_SIGN_UP } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';

class FormComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
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
		const {
			accountName, generatedPassword, confirmPassword, loading,
		} = this.props;

		return (
			<div className="field-wrap">
				<Form.Field className={classnames('error-wrap', { error: accountName.error })}>
					<label htmlFor="accountName">Account name (public)</label>
					<input
						name="accountName"
						className="ui input"
						placeholder="Account name"
						value={accountName.value}
						onChange={(e) => this.onChange(e, true)}
						disabled={loading}
						autoFocus
					/>
					<span className="error-message">{accountName.error}</span>
				</Form.Field>
				<Form.Field>
					<label htmlFor="generatedPassword">Generated password</label>
					<div className="ui action input">
						<input name="generatedPassword" className="ui input" placeholder="Genereted password" value={generatedPassword.value} readOnly />
						<CopyToClipboard text={generatedPassword.value}>
							<Button icon="copy" className="main-btn" />
						</CopyToClipboard>
					</div>
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: confirmPassword.error })}>
					<label htmlFor="confirmPassword">Confirm password</label>
					<input
						name="confirmPassword"
						className="ui input"
						placeholder="Confirm password"
						value={confirmPassword.value}
						onChange={(e) => this.onChange(e)}
						disabled={loading}
					/>
					<span className="error-message">{confirmPassword.error}</span>

				</Form.Field>
			</div>
		);
	}

}

FormComponent.propTypes = {
	accountName: PropTypes.object.isRequired,
	generatedPassword: PropTypes.object.isRequired,
	confirmPassword: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_UP, 'accountName']),
		generatedPassword: state.form.getIn([FORM_SIGN_UP, 'generatedPassword']),
		confirmPassword: state.form.getIn([FORM_SIGN_UP, 'confirmPassword']),
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_UP, field, value)),
		clearForm: () => dispatch(clearForm(FORM_SIGN_UP)),
	}),
)(FormComponent);

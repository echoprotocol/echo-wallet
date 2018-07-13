import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FORM_SIGN_UP } from '../../constants/FormConstants';

import { setFormValue } from '../../actions/FormActions';

class FormComponent extends React.Component {

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;

		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { accountName, generatedPassword, confirmPassword } = this.props;

		return (
			<div className="field-wrap">
				<Form.Field>
					<label htmlFor="accountName">Account name (public)</label>
					<div className={accountName.error ? 'error' : ''}>
						<input name="accountName" className="ui input" placeholder="Account name" value={accountName.value} onChange={(e) => this.onChange(e)} />
						<span className="error-message">{accountName.error}</span>
					</div>
				</Form.Field>
				<Form.Field>
					<label htmlFor="generatedPassword">Generated password</label>
					<div className="ui action input">
						<input name="generatedPassword" className="ui input" placeholder="Genereted password" value={generatedPassword.value} readOnly />
						<CopyToClipboard text={generatedPassword.value} className="ui orange icon right button">
							<button className="ui orange icon right button">
								<i aria-hidden="true" className="copy icon" />
							</button>
						</CopyToClipboard>
					</div>
				</Form.Field>
				<Form.Field>
					<label htmlFor="confirmPassword">Confirm password</label>
					<div className={confirmPassword.error ? 'error' : ''}>
						<input name="confirmPassword" className="ui input" placeholder="Confirm password" value={confirmPassword.value} onChange={(e) => this.onChange(e)} />
						<span className="error-message">{confirmPassword.error}</span>
					</div>
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
};

export default connect(
	(state) => ({
		accountName: state.form.getIn([FORM_SIGN_UP, 'accountName']),
		generatedPassword: state.form.getIn([FORM_SIGN_UP, 'generatedPassword']),
		confirmPassword: state.form.getIn([FORM_SIGN_UP, 'confirmPassword']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_SIGN_UP, field, value)),
	}),
)(FormComponent);

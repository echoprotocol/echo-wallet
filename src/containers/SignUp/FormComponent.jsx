import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';


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
			accountName, generatedWIF, confirmWIF, loading,
		} = this.props;

		return (
			<div className="field-wrap">
				<Form.Field className={classnames('error-wrap', { error: accountName.error })}>
					<label htmlFor="accountName">Account name (public)</label>
					<input
						name="accountName"
						placeholder="Account Name"
						value={accountName.value}
						onChange={(e) => this.onChange(e, true)}
						disabled={loading}
						autoFocus
					/>
					<span className="error-message">{accountName.error}</span>
				</Form.Field>
				<Form.Field>
					<label htmlFor="generatedWIF">Generated WIF</label>
					<div className="ui action input">
						<input name="generatedWIF" className="ui input" placeholder="Genereted WIF" value={generatedWIF.value} readOnly />
						<CopyToClipboard text={generatedWIF.value}>
							<Button icon="copy" className="input-copy-btn" />
						</CopyToClipboard>
					</div>
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: confirmWIF.error })}>
					<label htmlFor="confirmWIF">Confirm WIF</label>
					<input
						name="confirmWIF"
						placeholder="Confirm WIF"
						value={confirmWIF.value}
						onChange={(e) => this.onChange(e)}
						disabled={loading}
					/>
					<span className="error-message">{confirmWIF.error}</span>

				</Form.Field>
			</div>
		);
	}

}

FormComponent.propTypes = {
	accountName: PropTypes.object.isRequired,
	generatedWIF: PropTypes.object.isRequired,
	confirmWIF: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default FormComponent;

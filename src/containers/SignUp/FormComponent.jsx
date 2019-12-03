import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import InputActionBtn from '../../components/InputActionBtn';

class FormComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userWIF: false,
		};
	}
	componentWillUnmount() {
		this.props.clearForm();
	}
	onToogleWifType() {
		this.setState({ userWIF: !this.state.userWIF });
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

	renderGeneratedWIF() {
		const { generatedWIF, confirmWIF, loading } = this.props;
		return (
			<React.Fragment>
				<Form.Field>
					<div className="label-wrap">
						<label htmlFor="generatedWIF">Generated WIF</label>
						<button onClick={() => this.onToogleWifType()} className="link-btn">Or use your own WIF or Public Key</button>
					</div>
					<div className="ui action input">
						<input
							name="generatedWIF"
							className="ui input"
							placeholder="Genereted WIF"
							value={generatedWIF.value}
							readOnly
						/>
						<InputActionBtn copy={generatedWIF.value} />
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
					{ confirmWIF.error && <span className="error-message">{confirmWIF.error}</span> }
				</Form.Field>
			</React.Fragment>
		);
	}

	renderUserWIF() {
		const { loading } = this.props;
		return (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: false })}>
					<h3 className="field-title">You can use your own WIF or Public Key:</h3>
					<div className="label-wrap">
						<label htmlFor="userWIF">WIF (optional)</label>
						<button onClick={() => this.onToogleWifType()} className="link-btn">Or generate WIF</button>
					</div>
					<input
						name="userWIF"
						placeholder="WIF"
						disabled={loading}
					/>
					{false && <span className="error-message">some error</span>}
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: false })}>
					<label htmlFor="confirmWIF">PUBLIC KEY</label>
					<input
						name="publicKey"
						placeholder="Enter public key"
						disabled={loading}
					/>
					{false && <span className="error-message">some error</span>}
				</Form.Field>
			</React.Fragment>
		);
	}

	render() {
		const { accountName, loading } = this.props;
		const { userWIF } = this.state;
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
					{ accountName.error && <span className="error-message">{accountName.error}</span> }
				</Form.Field>
				{ userWIF ? this.renderUserWIF() : this.renderGeneratedWIF() }

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

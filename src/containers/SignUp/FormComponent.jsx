import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import { PrivateKey } from 'echojs-lib';
import ActionBtn from '../../components/ActionBtn';

class FormComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}
	onToogleWifType() {
		this.props.setValue('isCustomWIF', !this.props.isCustomWIF);
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

	onCustomChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		this.props.setFormValue(field, value);
	}
	validateWIFAfterChange(e) {
		const { value } = e.target;
		if (value) {
			try {
				const publicKey = PrivateKey.fromWif(value).toPublicKey().toString();
				this.props.setFormValue('userPublicKey', publicKey);
				if (this.props.userWIF.error) {
					this.props.setFormError(this.props.userWIF, null);
				}
			} catch (err) {
				this.props.setFormError('userWIF', 'Invalid WIF');
			}
		}
	}
	validatePubAfterChange(e) {
		const { value } = e.target;
		if (value && this.props.userWIF.value) {
			try {
				const publicKeyFromWif = PrivateKey.fromWif(this.props.userWIF.value)
					.toPublicKey().toString();
				if (publicKeyFromWif === value) {
					if (this.props.userPublicKey.error) {
						this.props.setFormError(this.props.userPublicKey, null);
					}
				} else {
					this.props.setFormError('userPublicKey', 'Invalide private key for current public key');
				}
			} catch (err) {
				this.props.setFormError('userPublicKey', 'You have an invalid private key');
			}
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
					<div className="action input">
						<input
							name="generatedWIF"
							className="ui input"
							placeholder="Genereted WIF"
							value={generatedWIF.value}
							readOnly
						/>
						<ActionBtn
							icon="icon-copy"
							copy={generatedWIF.value}
						/>
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
		const { loading, userPublicKey, userWIF } = this.props;
		return (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: userWIF.error })}>
					<h3 className="field-title">You can use your own WIF or Public Key:</h3>
					<div className="label-wrap">
						<label htmlFor="userWIF">WIF (optional)</label>
						<button onClick={() => this.onToogleWifType()} className="link-btn">Or generate WIF</button>
					</div>
					<input
						name="userWIF"
						placeholder="WIF"
						disabled={loading}
						value={userWIF.value}
						onChange={(e) => {
							this.onCustomChange(e);
							this.validateWIFAfterChange(e);
						}}
					/>
					<span className="error-message">{userWIF.error}</span>
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: userPublicKey.error })}>
					<label htmlFor="confirmWIF">PUBLIC KEY</label>
					<input
						name="userPublicKey"
						placeholder="Enter public key"
						disabled={loading}
						value={userPublicKey.value}
						onChange={(e) => {
							this.onCustomChange(e);
							this.validatePubAfterChange(e);
						}}
					/>
					<span className="error-message">{userPublicKey.error}</span>
				</Form.Field>
			</React.Fragment>
		);
	}

	render() {
		const { accountName, loading, isCustomWIF } = this.props;
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
				{ isCustomWIF ? this.renderUserWIF() : this.renderGeneratedWIF() }

			</div>
		);
	}

}

FormComponent.propTypes = {
	accountName: PropTypes.object.isRequired,
	generatedWIF: PropTypes.object.isRequired,
	confirmWIF: PropTypes.object.isRequired,
	isCustomWIF: PropTypes.bool,
	userPublicKey: PropTypes.object.isRequired,
	userWIF: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

FormComponent.defaultProps = {
	isCustomWIF: false,
};

export default FormComponent;

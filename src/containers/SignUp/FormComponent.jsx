import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { PrivateKey } from 'echojs-lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import ActionBtn from '../../components/ActionBtn';
import ErrorMessage from '../../components/ErrorMessage';

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
				this.props.setFormError('userWIF', 'errors.keys_errors.invalid_wif_error');
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
					this.props.setFormError('userPublicKey', 'errors.keys_errors.keys_dont_match_error');
				}
			} catch (err) {
				this.props.setFormError('userPublicKey', 'errors.keys_errors.user_invalid_priv_error');
			}
		}
	}

	renderGeneratedWIF() {
		const {
			generatedWIF, confirmWIF, loading, intl,
		} = this.props;

		const confirmWIFPlaceholder = intl.formatMessage({ id: 'sign_page.register_account_page.default_settings_page.confirm_wif_input.title' });

		return (
			<React.Fragment>
				<div className="field">
					<div className="label-wrap">
						<label htmlFor="generatedWIF">
							<FormattedMessage id="sign_page.register_account_page.default_settings_page.generated_wif_input.title" />
						</label>
						<button
							type="button"
							onClick={() => this.onToogleWifType()}
							className="link-btn"
						>
							<FormattedMessage id="sign_page.register_account_page.default_settings_page.text_to_custom_settings" />
						</button>
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
				</div>
				<div className={classnames('field error-wrap', { error: confirmWIF.error })}>
					<label htmlFor="confirmWIF">
						<FormattedMessage id="sign_page.register_account_page.default_settings_page.confirm_wif_input.title" />
					</label>
					<input
						name="confirmWIF"
						placeholder={confirmWIFPlaceholder}
						value={confirmWIF.value}
						onChange={(e) => this.onChange(e)}
						disabled={loading}
					/>
					{confirmWIF.error &&
					<span className="error-message">{intl.formatMessage({ id: confirmWIF.error })}</span>}
				</div>
			</React.Fragment>
		);
	}

	renderUserWIF() {
		const {
			loading, userPublicKey, userWIF, intl,
		} = this.props;
		const WIFPlaceholder = intl.formatMessage({ id: 'sign_page.register_account_page.custom_settings_page.wif_input.placeholder' });
		const pubKeyPlaceholder = intl.formatMessage({ id: 'sign_page.register_account_page.custom_settings_page.pub_key_input.placeholder' });
		return (
			<React.Fragment>
				<div className={classnames('field error-wrap', { error: userWIF.error })}>
					<h3 className="field-title">
						<FormattedMessage id="sign_page.register_account_page.custom_settings_page.text" />
					</h3>
					<div className="label-wrap">
						<label htmlFor="userWIF">
							<FormattedMessage id="sign_page.register_account_page.custom_settings_page.wif_input.title" />
						</label>
						<button onClick={() => this.onToogleWifType()} className="link-btn">
							<FormattedMessage id="sign_page.register_account_page.custom_settings_page.text_to_custom_settings" />
						</button>
					</div>
					<input
						name="userWIF"
						placeholder={WIFPlaceholder}
						disabled={loading}
						value={userWIF.value}
						onChange={(e) => {
							this.onCustomChange(e);
							this.validateWIFAfterChange(e);
						}}
					/>
					<ErrorMessage
						show={!!userWIF.error}
						value={intl.formatMessage({ id: userWIF.error })}
					/>
				</div>
				<div className={classnames('field error-wrap', { error: userPublicKey.error })}>
					<label htmlFor="confirmWIF">
						<FormattedMessage id="sign_page.register_account_page.custom_settings_page.pub_key_input.title" />
					</label>
					<input
						name="userPublicKey"
						placeholder={pubKeyPlaceholder}
						disabled={loading}
						value={userPublicKey.value}
						onChange={(e) => {
							this.onCustomChange(e);
							this.validatePubAfterChange(e);
						}}
					/>
					<ErrorMessage
						show={!!userPublicKey.error}
						value={intl.formatMessage({ id: userPublicKey.error })}
					/>
				</div>
			</React.Fragment>
		);
	}

	render() {
		const {
			accountName, loading, isCustomWIF, intl,
		} = this.props;
		const accountPlaceholder = intl.formatMessage({ id: 'sign_page.register_account_page.default_settings_page.name_input.placeholder' });

		return (
			<div className="field-wrap">
				<div className={classnames('field error-wrap', { error: accountName.error })}>
					<label htmlFor="accountName">
						<FormattedMessage id="sign_page.register_account_page.default_settings_page.name_input.title" />
					</label>
					<input
						name="accountName"
						placeholder={accountPlaceholder}
						value={accountName.value}
						onChange={(e) => this.onChange(e, true)}
						disabled={loading}
						autoFocus
					/>
					<ErrorMessage
						show={!!accountName.error}
						value={intl.formatMessage({ id: accountName.error })}
					/>
				</div>
				{isCustomWIF ? this.renderUserWIF() : this.renderGeneratedWIF()}
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
	intl: PropTypes.any.isRequired,
};

FormComponent.defaultProps = {
	isCustomWIF: false,
};

export default injectIntl(FormComponent);

import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import FocusLock from 'react-focus-lock';
import PasswordInput from '../PasswordInput';

class ModalUnlockWallet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			password: '',
		};
	}

	onForgot(e) {
		e.preventDefault();

		this.props.forgot();
	}

	onSuccess() {
		this.props.unlock();
	}

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	onChange(e) {
		this.setState({ password: e.target.value.trim() });
		this.props.change(e.target.value.trim());
	}

	render() {
		const {
			show, error, disabled, intl,
		} = this.props;
		const { password } = this.state;
		return (
			<Modal className="modal-wrap" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_unlock.title' })}
						</h2>
					</div>
					<Form className="main-form modal-body">
						<div className="field-wrap">
							<PasswordInput
								key="modal-unlock-password"
								unique="unique-modal-unlock-password"
								errorMessage={error}
								inputLabel={intl.formatMessage({ id: 'modals.modal_unlock.password_input.title' })}
								inputPlaceholder={intl.formatMessage({ id: 'modals.modal_unlock.password_input.placeholder' })}
								inputName="password"
								value={password}
								onChange={(e) => this.onChange(e)}
								autoFocus
								intl={intl}
							/>
						</div>
						<div className="form-panel">
							<a
								className="action-link"
								role="button"
								onClick={(e) => this.onForgot(e)}
								onKeyPress={(e) => this.onForgot(e)}
								tabIndex="0"
							>
								{intl.formatMessage({ id: 'modals.modal_unlock.forgot_password_link' })}
							</a>
							<Button
								type="submit"
								className="main-btn"
								onClick={(e) => this.onSuccess(e)}
								disabled={disabled}
								content={intl.formatMessage({ id: 'modals.modal_unlock.confirm_button_text' })}
							/>
						</div>
					</Form>
				</FocusLock>
			</Modal>
		);
	}

}

ModalUnlockWallet.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	forgot: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default injectIntl(ModalUnlockWallet);

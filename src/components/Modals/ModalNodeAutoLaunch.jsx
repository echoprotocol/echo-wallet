import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FocusLock from 'react-focus-lock';

import { closeModal, openModal, setError } from '../../actions/ModalActions';

import { MODAL_AUTO_LAUNCH_NODE } from '../../constants/ModalConstants';
import { removeAccount } from '../../actions/GlobalActions';
import PasswordInput from '../PasswordInput';

class ModalNodeAutoLaunch extends React.Component {

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
		this.props.change(e.target.value.trim());
	}

	render() {
		const {
			show, error, disabled, password, intl,
		} = this.props;

		const btnWaitText = intl.formatMessage({ id: 'modals.modal_edit_permissions.button_text.wait_mode' });
		const btnReadyText = intl.formatMessage({ id: 'modals.modal_edit_permissions.button_text.ready_mode' });
		return (
			<Modal className="edit-permissions-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_edit_permissions.title' })}
						</h3>
					</div>
					<Form className="modal-body">
						<div className="info-text">
							{intl.formatMessage({ id: 'modals.modal_edit_permissions.text' })}
						</div>
						<div className="field-wrap">
							<PasswordInput
								key="modal-permission-password"
								unique="unique-modal-permission-password"
								errorMessage={error}
								inputLabel={intl.formatMessage({ id: 'modals.modal_edit_permissions.password_input.title' })}
								inputPlaceholder={intl.formatMessage({ id: 'modals.modal_edit_permissions.password_input.placeholder' })}
								inputName="password"
								value={password}
								onChange={(e) => this.onChange(e)}
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
								{intl.formatMessage({ id: 'modals.modal_edit_permissions.forgot_password_link' })}
							</a>
							<Button
								type="submit"
								className="main-btn countdown-wrap"
								onClick={(e) => this.onSuccess(e)}
								disabled={disabled}
							>aaaa
							</Button>
						</div>
					</Form>
				</FocusLock>
			</Modal>
		);
	}

}

ModalNodeAutoLaunch.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	password: PropTypes.string.isRequired,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	forgot: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalNodeAutoLaunch.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_AUTO_LAUNCH_NODE, 'show']),
		error: state.modal.getIn([MODAL_AUTO_LAUNCH_NODE, 'error']),
		accountName: state.modal.getIn([MODAL_AUTO_LAUNCH_NODE, 'accountName']),
	}),
	(dispatch) => ({
		logout: (accountName, password) => dispatch(removeAccount(accountName, password)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		openModal: (modal) => dispatch(openModal(modal)),
		clear: () => dispatch(setError(MODAL_AUTO_LAUNCH_NODE, null)),
	}),
)(ModalNodeAutoLaunch));

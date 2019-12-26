import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FocusLock from 'react-focus-lock';

import { closeModal, setError, openModal } from '../../actions/ModalActions';
import { startLocalNode } from '../../actions/GlobalActions';
import { unlock } from '../../actions/AuthActions';

import { MODAL_AUTO_LAUNCH_NODE, MODAL_WIPE } from '../../constants/ModalConstants';
import PasswordInput from '../PasswordInput';

class ModalNodeAutoLaunch extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	onSuccess() {
		const { password } = this.state;

		this.props.unlock(password, () => {
			this.props.startLocalNode(password);
			this.clear();
		});
	}

	onClose(e) {
		e.preventDefault();
		this.clear();
	}

	onForgot(e) {
		e.preventDefault();
		this.clear();
		this.props.openModal(MODAL_WIPE);
	}

	onChange(e) {
		const password = e.target.value.trim();

		this.setState({ password });

		if (this.props.error) {
			this.props.clearError();
		}
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
		this.props.clearError();
		this.props.close();
	}

	render() {
		const {
			show, error, disabled, intl,
		} = this.props;

		const { password } = this.state;

		return (
			<Modal className="edit-permissions-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_auto_run_local_node.title' })}
						</h3>
					</div>
					<Form className="modal-body">
						<div className="field-wrap">
							<PasswordInput
								key="modal-permission-password"
								unique="unique-modal-permission-password"
								errorMessage={error}
								inputLabel={intl.formatMessage({ id: 'modals.modal_auto_run_local_node.password_input.title' })}
								inputPlaceholder={intl.formatMessage({ id: 'modals.modal_auto_run_local_node.password_input.placeholder' })}
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
								{intl.formatMessage({ id: 'modals.modal_auto_run_local_node.forgot_password_link' })}
							</a>
							<Button
								type="submit"
								className="main-btn countdown-wrap"
								onClick={(e) => this.onSuccess(e)}
								disabled={disabled}
							>
								{intl.formatMessage({ id: 'modals.modal_auto_run_local_node.confirm_button_text' })}
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
	unlock: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	startLocalNode: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
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
		close: () => dispatch(closeModal(MODAL_AUTO_LAUNCH_NODE)),
		openModal: (value) => dispatch(openModal(value)),
		startLocalNode: (password) => dispatch(startLocalNode(password)),
		unlock: (password, callback) => dispatch(unlock(password, callback, MODAL_AUTO_LAUNCH_NODE)),
		clearError: () => dispatch(setError(MODAL_AUTO_LAUNCH_NODE, null)),
	}),
)(ModalNodeAutoLaunch));

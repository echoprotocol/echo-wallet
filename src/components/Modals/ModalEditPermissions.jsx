/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import PasswordInput from '../PasswordInput';

class ModalEditPermissions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			agree: false,
			timerComplete: false,
			timer: null,
			time: props.warningTime,
		};
	}


	componentDidUpdate(prevProps) {
		if (this.props.show && !prevProps.show) {
			const t = setInterval(() => {
				this.setState({ time: this.state.time - 1 }, () => {
					if (this.state.time === 0) {
						clearTimeout(this.state.timer);
						this.setState({ timerComplete: true });
					}
				});
			}, 1000);
			this.setState({ timer: t });
		} else if (!this.props.show && prevProps.show) {
			clearTimeout(this.state.timer);
			this.setState({ timer: null, time: this.props.warningTime, timerComplete: false });
		}
	}


	onCheck(e) {
		this.setState({ agree: e.currentTarget.checked });
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
		this.props.change(e.target.value.trim());
	}

	countdown(seconds) {
		return !this.state.timerComplete &&
			<div className="countdown">
				<div className="countdown-text">{seconds}</div>
			</div>;
	}

	render() {
		const {
			show, error, disabled, password, intl,
		} = this.props;

		const { agree, timerComplete } = this.state;

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
					<form className="modal-body">
						<div className="info-text">
							{intl.formatMessage({ id: 'modals.modal_edit_permissions.text' })}
						</div>
						<div className="check-list">
							<div className="check">
								<input type="checkbox" id="edit-mode-checkbox" onChange={(e) => this.onCheck(e)} />
								<label className="label" htmlFor="edit-mode-checkbox">
									<span className="label-text">
										{intl.formatMessage({ id: 'modals.modal_edit_permissions.checkbox_text' })}
									</span>
								</label>
							</div>
						</div>
						<PasswordInput
							errorMessage={error ? intl.formatMessage({ id: error }) : ''}
							inputLabel={intl.formatMessage({ id: 'modals.modal_edit_permissions.password_input.title' })}
							inputPlaceholder={intl.formatMessage({ id: 'modals.modal_edit_permissions.password_input.placeholder' })}
							inputName="password"
							value={password}
							onChange={(e) => this.onChange(e)}
						/>
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
								disabled={(disabled) || !(agree && timerComplete)}
							>
								{this.countdown(this.state.time)}
								{(agree && timerComplete) ? btnReadyText : btnWaitText}
							</Button>
						</div>
					</form>
				</FocusLock>
			</Modal>
		);
	}

}

ModalEditPermissions.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	password: PropTypes.string.isRequired,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	forgot: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	warningTime: PropTypes.number,
};

ModalEditPermissions.defaultProps = {
	show: false,
	disabled: false,
	error: null,
	warningTime: 0,
};

export default injectIntl(ModalEditPermissions);

/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';

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
			show, error, disabled, password,
		} = this.props;

		const { agree, timerComplete } = this.state;

		return (
			<Modal className="edit-permissions-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">Edit Mode Warning</h3>
					</div>
					<Form className="modal-body">
						<div className="info-text">
							Please, keep in mind that uncontrolled changes may lead to
							loosing access to the wallet or restricting your actions within it.
							Be careful with editing permissions and adding the accounts to manage the wallet,
							ensuring that you grant permissions only to the accounts you trust.
						</div>
						<div className="check-list">
							<div className="check">
								<input type="checkbox" id="edit-mode-checkbox" onChange={(e) => this.onCheck(e)} />
								<label className="label" htmlFor="edit-mode-checkbox">
									<span className="label-text">I have read and understood the possible consequences of editing</span>
								</label>
							</div>
						</div>
						<PasswordInput
							errorMessage={error}
							inputLabel="Password"
							inputPlaceholder="Password"
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
								Forgot password?
							</a>
							<Button
								type="submit"
								className="main-btn countdown-wrap"
								onClick={(e) => this.onSuccess(e)}
								disabled={(disabled) || !(agree && timerComplete)}
							>
								{this.countdown(this.state.time)}
								{(agree && timerComplete) ? 'Go to edit mode' : 'READ PLEASE'}
							</Button>
						</div>
					</Form>
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
	warningTime: PropTypes.number,
};

ModalEditPermissions.defaultProps = {
	show: false,
	disabled: false,
	error: null,
	warningTime: 0,
};

export default ModalEditPermissions;

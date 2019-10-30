import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';


class ModalEditPermissions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			agree: false,
			timerIsOn: false,
			timerComplete: false,
			show: false,
			changeVisiblity: false,
		};
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		return nextProps.show !== prevState.show ? {
			show: nextProps.show,
			changeVisiblity: true,
			timerComplete: false,
			agree: false,
		} : {
			changeVisiblity: false,
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.changeVisiblity) ? true : !(nextState.timerIsOn && !nextState.timerComplete);
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
	countdown({ seconds }) {
		return !this.state.timerComplete &&
			<div className="countdown">
				<div className="countdown-text">{seconds}</div>
			</div>;
	}

	render() {
		const {
			show, error, disabled, warningTime,
		} = this.props;
		const { agree, timerComplete } = this.state;

		return (
			<Modal className="edit-permissions-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Edit Mode Warning</h3>
				</div>
				<form className="modal-body">
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
					<Form.Field className={classnames('error-wrap', { error: !!error })}>
						<label htmlFor="Password">Password</label>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={(e) => this.onChange(e)}
							autoFocus
						/>
						{
							error && <span className="error-message">{error}</span>
						}
					</Form.Field>
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
							basic
							type="submit"
							className="main-btn countdown-wrap"
							onClick={(e) => this.onSuccess(e)}
							disabled={(disabled) || !(agree && timerComplete)}
						>
							<Countdown
								date={Date.now() + (warningTime * 1000)}
								renderer={(props) => this.countdown(props)}
								onStart={() => this.setState({ timerIsOn: true })}
								onComplete={() => this.setState({
									timerComplete: true,
									timerIsOn: false,
								})}
							/>
							{(agree && timerComplete) ? 'Go to edit mode' : 'READ PLEASE'}
						</Button>
					</div>
				</form>
			</Modal>
		);
	}

}

ModalEditPermissions.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
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

import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';

class ModalTimer extends React.Component {

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
	timer({ seconds }) {
		return this.state.timerComplete ? null : <span> {seconds} </span>;
	}
	renderModalHeader() {
		const { warningTextValue, warningTextChackbox, warningTime } = this.props;
		return (
			<React.Fragment>
				<h3>
					<Countdown
						date={Date.now() + (warningTime * 1000)}
						renderer={(props) => this.timer(props)}
						onStart={() => this.setState({ timerIsOn: true })}
						onComplete={() => this.setState({
							timerComplete: true,
							timerIsOn: false,
						})}
					/>
					Edit Mode Warning
				</h3>
				<h4>{warningTextValue}</h4>
				<input type="checkbox" id="agree" onChange={(e) => this.onCheck(e)} />
				<label className="label" htmlFor="agree" >
					<span className="label-text">{warningTextChackbox}</span>
				</label>
			</React.Fragment>
		);
	}
	render() {
		const {
			show, error, disabled, title,
		} = this.props;
		const { agree, timerComplete } = this.state;
		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content">

					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header">
						{this.renderModalHeader()}
					</div >
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>{title}</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: !!error })}>
									<label htmlFor="Password">Password</label>
									<input
										type="password"
										placeholder="Password"
										name="password"
										className="ui input"
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>
									<span className="error-message">{error}</span>
								</Form.Field>
							</div>
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
									className="main-btn"
									onClick={(e) => this.onSuccess(e)}
									disabled={(disabled) || !(agree && timerComplete)}
									content="Unlock Wallet"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalTimer.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	forgot: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	title: PropTypes.string,
	warningTextValue: PropTypes.string,
	warningTextChackbox: PropTypes.string,
	warningTime: PropTypes.number,
};

ModalTimer.defaultProps = {
	show: false,
	disabled: false,
	error: null,
	title: 'Unlock Wallet',
	warningTextValue: '',
	warningTextChackbox: '',
	warningTime: 0,
};

export default ModalTimer;

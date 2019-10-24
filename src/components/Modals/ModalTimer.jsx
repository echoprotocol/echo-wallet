import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ModalUnlockWallet extends React.Component {

	constructor(props) {
		super(props);
		let agree;
		if (props.warningTextValue) {
			agree = false;
		} else {
			agree = true;
		}
		this.state = {
			agree,
			time: props.warningTime,
			timerIsOn: false,
		};
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.show && nextProps.warningTime && !(prevState.timerIsOn)) {
			return ({
				timerIsOn: true,
			});
		}
		return prevState;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.show && this.props.warningTime && !(prevState.timerIsOn)) {
			const { warningTime } = this.props;
			const timerIsOn = setInterval(() => this.decrementTime(), 1000);
			setTimeout(() => {
				clearInterval(timerIsOn);
				return ({ timerIsOn: false });
			}, (warningTime * 1000) + 1000);
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
	decrementTime() {
		this.setState({ time: this.state.time - 1 });
	}
	renderModalHeader() {
		const { warningTextValue, warningTextChackbox } = this.props;
		return (
			<React.Fragment>
				<h3> {this.state.time ? this.state.time : null} Edit Mode Warning</h3>
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
		const { agree, time } = this.state;
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
									disabled={disabled || !(agree && time === 0)}
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

ModalUnlockWallet.propTypes = {
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

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
	title: 'Unlock Wallet',
	warningTextValue: '',
	warningTextChackbox: '',
	warningTime: 0,
};

export default ModalUnlockWallet;

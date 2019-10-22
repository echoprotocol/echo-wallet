import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ModalUnlockWallet extends React.Component {

	constructor(props) {
		super(props);
		if (props.warningTextValue) {
			this.state = {
				agree: false,
				timerEnd: false,
			};
		} else {
			this.state = {
				agree: true,
				timerEnd: true,
			};
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
	timer() {
		// this.setState({ timerEnd: true });
		return (<span> 1 </span>);
	}
	renderModalHeader() {
		const { warningTextValue, warningTextChackbox } = this.props;
		return (
			<React.Fragment>
				<h3> {this.timer()} Edit Mode Warning</h3>
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
			show, error, disabled, title, warningTextValue,
		} = this.props;
		const { agree, timerEnd } = this.state;
		if (warningTextValue) {
			console.log(agree, disabled);
			console.log(disabled && !agree);
		}
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
						{this.props.warningTextValue ? this.renderModalHeader() : null}
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
									disabled={disabled || !(agree && timerEnd)}
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
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
	title: 'Unlock Wallet',
	warningTextValue: '',
	warningTextChackbox: '',
};

export default ModalUnlockWallet;

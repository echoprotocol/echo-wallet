import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ModalUnlockWallet extends React.Component {

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
			show, error, disabled,
		} = this.props;

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
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Unlock Wallet</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: !!error })}>
									<label htmlFor="Password">Password</label>
									<input
										type="password"
										placeholder="Password"
										name="password"
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>
									<div className="error-message error-animation">
										<span>{error}</span>
									</div>
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
									disabled={disabled}
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
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default ModalUnlockWallet;

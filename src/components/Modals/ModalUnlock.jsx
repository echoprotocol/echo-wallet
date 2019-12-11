import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
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
			show, error, disabled,
		} = this.props;
		const { password } = this.state;
		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content">
						<button
							className="icon-close"
							onClick={(e) => this.onClose(e)}
						/>
						<div className="modal-header" />
						<div className="modal-body">
							<Form className="main-form">
								<div className="form-info">
									<h3>Unlock Wallet</h3>
								</div>
								<div className="field-wrap">
									<PasswordInput
										errorMessage={error}
										inputLabel="Password"
										inputPlaceholder="Password"
										inputName="password"
										value={password}
										onChange={(e) => this.onChange(e)}
										autoFocus
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
											Forgot password?
									</a>
									<Button
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
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default ModalUnlockWallet;

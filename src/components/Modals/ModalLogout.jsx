import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { closeModal, openModal, setError } from '../../actions/ModalActions';

import { MODAL_LOGOUT, MODAL_WIPE } from '../../constants/ModalConstants';
import { removeAccount } from '../../actions/GlobalActions';


class ModalLogout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.show && !this.props.show) {
			this.clear();
		}
	}

	onChange(e) {
		this.setState({ password: e.target.value.trim() });

		if (this.props.error) {
			this.props.clear(MODAL_LOGOUT);
		}
	}

	onForgot(e) {
		e.preventDefault();

		this.clear();
		this.props.closeModal(MODAL_LOGOUT);
		this.props.openModal(MODAL_WIPE);
	}

	onClose() {
		this.clear();
		this.props.closeModal(MODAL_LOGOUT);
	}

	onConfirm() {
		const { accountName } = this.props;
		const { password } = this.state;

		this.props.logout(accountName, password);
	}

	clear() {
		this.setState({ password: '' });
	}

	render() {
		const { show, error } = this.props;
		const { password } = this.state;

		return (
			<Modal className="small" open={show} dimmer="inverted">
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
								<h3>Confirm logout</h3>
							</div>
							You will be signed out of your account.
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: !!error })}>
									<label htmlFor="Password">Password</label>
									<input
										type="password"
										placeholder="Password"
										name="password"
										className="ui input"
										value={password}
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
									type="button"
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									basic
									type="submit"
									className="main-btn"
									onClick={() => this.onConfirm()}
									content="Confirm"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalLogout.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	accountName: PropTypes.string.isRequired,
	logout: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
	error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_LOGOUT, 'show']),
		error: state.modal.getIn([MODAL_LOGOUT, 'error']),
		loading: state.modal.getIn([MODAL_LOGOUT, 'loading']),
		accountName: state.modal.getIn([MODAL_LOGOUT, 'accountName']),
	}),
	(dispatch) => ({
		logout: (accountName, password) => dispatch(removeAccount(accountName, password)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		openModal: (modal) => dispatch(openModal(modal)),
		clear: () => dispatch(setError(MODAL_LOGOUT, null)),
	}),
)(ModalLogout);

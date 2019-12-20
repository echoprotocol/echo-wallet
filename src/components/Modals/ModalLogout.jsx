import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FocusLock from 'react-focus-lock';

import { closeModal, openModal, setError } from '../../actions/ModalActions';

import { MODAL_LOGOUT, MODAL_WIPE } from '../../constants/ModalConstants';
import { removeAccount } from '../../actions/GlobalActions';
import PasswordInput from '../PasswordInput';


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
		const { show, error, intl } = this.props;
		const { password } = this.state;

		return (
			<Modal className="modal-wrap" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							Confirm logout
						</h2>
					</div>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<Form className="main-form">

						<div className="form-info">
							<h3>{intl.formatMessage({ id: 'modals.modal_confirm_logout.title' })}</h3>
						</div>
						{intl.formatMessage({ id: 'modals.modal_confirm_logout.subtitle' })}
						<div className="field-wrap">
							<PasswordInput
								errorMessage={error}
								inputLabel={
									intl.formatMessage({ id: 'modals.modal_confirm_logout.password_input.title' })
								}
								inputPlaceholder={
									intl.formatMessage({ id: 'modals.modal_confirm_logout.password_input.placeholder' })
								}
								inputName="password"
								value={password}
								onChange={(e) => this.onChange(e)}
								autoFocus
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
								{intl.formatMessage({ id: 'modals.modal_confirm_logout.forgot_password_link' })}
							</a>
							<Button
								className="main-btn"
								type="button"
								onClick={() => this.onClose()}
								content={intl.formatMessage({ id: 'modals.modal_confirm_logout.close_button_text' })}
							/>
							<Button
								type="submit"
								className="main-btn"
								onClick={() => this.onConfirm()}
								content={intl.formatMessage({ id: 'modals.modal_confirm_logout.confirm_button_text' })}
							/>
						</div>
					</Form>
				</FocusLock>
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
	intl: PropTypes.any.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_LOGOUT, 'show']),
		error: state.modal.getIn([MODAL_LOGOUT, 'error']),
		accountName: state.modal.getIn([MODAL_LOGOUT, 'accountName']),
	}),
	(dispatch) => ({
		logout: (accountName, password) => dispatch(removeAccount(accountName, password)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		openModal: (modal) => dispatch(openModal(modal)),
		clear: () => dispatch(setError(MODAL_LOGOUT, null)),
	}),
)(ModalLogout));

import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { closeModal } from '../../actions/ModalActions';
import { setFormValue, clearForm } from '../../actions/FormActions';
import { unlockAccount } from '../../actions/AuthActions';

import { MODAL_UNLOCK } from './../../constants/ModalConstants';
import { FORM_UNLOCK_MODAL } from '../../constants/FormConstants';

class ModalUnlockWallet extends React.Component {

	componentWillUnmount() {
		this.props.clearForm(FORM_UNLOCK_MODAL);
	}

	onSuccess() {
		const { accountName, password } = this.props;

		this.props.unlockAccount({
			accountName,
			password: password.value,
		});
	}

	onClose(e) {
		e.preventDefault();
		const {	disableBackgroundClick } = this.props;
		if (disableBackgroundClick) {
			return;
		}

		this.props.closeModal();
		this.props.clearForm(FORM_UNLOCK_MODAL);
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;

		if (field) {
			this.props.setFormValue(field, value.trim());
		}
	}

	render() {
		const {
			show, password, loading, disabled,
		} = this.props;

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
								<h3>Unlock Wallet</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: password.error })}>
									<label htmlFor="Password">Password</label>
									<input
										type="password"
										placeholder="Password"
										name="password"
										className="ui input"
										value={password.value}
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>
									<span className="error-message">{password.error}</span>
								</Form.Field>
							</div>
							{loading
								? <Button
									type="submit"
									className="load main-btn"
									content="Loading..."
								/>
								: <Button
									basic
									type="submit"
									className="main-btn"
									onClick={(e) => this.onSuccess(e)}
									disabled={disabled}
									content="Unlock Wallet"
								/>
							}
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalUnlockWallet.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool.isRequired,
	disableBackgroundClick: PropTypes.bool,
	loading: PropTypes.bool,
	accountName: PropTypes.string,
	password: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disableBackgroundClick: false,
	loading: false,
	accountName: '',
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_UNLOCK, 'show']),
		disabled: state.modal.getIn([MODAL_UNLOCK, 'disabled']),
		password: state.form.getIn([FORM_UNLOCK_MODAL, 'password']),
		loading: state.form.getIn([FORM_UNLOCK_MODAL, 'loading']),
		accountName: state.transaction.getIn(['showOptions', 'from']),
	}),
	(dispatch) => ({
		unlockAccount: (value) => dispatch(unlockAccount(value)),
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_UNLOCK_MODAL, field, value)),
		clearForm: (value) => dispatch(clearForm(value)),
	}),
)(ModalUnlockWallet);

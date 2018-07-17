import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_UNLOCK } from './../../constants/ModalConstants';
import { unlockUser } from '../../actions/AuthActions';
import { FORM_UNLOCK_MODAL } from '../../constants/FormConstants';
import { setFormValue } from '../../actions/FormActions';

class ModalUnlockWallet extends React.Component {

	onSuccess() {
		const { password } = this.props;

		this.props.unlockUser({
			password: password.value,
		});
	}

	onCancel() {

		this.props.closeModal();
	}

	onClose(e) {
		e.preventDefault();
		const {	disableBackgroundClick } = this.props;
		if (disableBackgroundClick) {
			return;
		}

		this.onCancel();
	}

	onChange(e, lowerCase) {
		const field = e.target.name;
		let { value } = e.target;

		if (lowerCase) {
			value = value.toLowerCase();
		}

		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { show, password, loading } = this.props;

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
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="Password">Password</label>
									<div className={password.error ? 'error' : ''}>
										<input placeholder="Password" name="password" className="ui input" value={password.value} onChange={(e) => this.onChange(e)} />
										<span className="error-message">{password.error}</span>
									</div>
								</Form.Field>
							</div>
							{loading
								? <Button type="submit" color="orange" className="load" >Loading...</Button>
								: <Button basic type="submit" color="orange" onClick={(e) => this.onSuccess(e)}>Unlock Wallet</Button>
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
	disableBackgroundClick: PropTypes.bool,
	closeModal: PropTypes.func,
	password: PropTypes.object.isRequired,
	unlockUser: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disableBackgroundClick: false,
	loading: false,
	closeModal: () => {},
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_UNLOCK, 'show']),
		password: state.form.getIn([FORM_UNLOCK_MODAL, 'password']),
		loading: state.form.getIn([FORM_UNLOCK_MODAL, 'loading']),
	}),
	(dispatch) => ({
		unlockUser: (value) => dispatch(unlockUser(value)),
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_UNLOCK_MODAL, field, value)),
	}),
)(ModalUnlockWallet);

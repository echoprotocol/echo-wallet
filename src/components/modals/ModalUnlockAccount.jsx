import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_UNLOCK } from './../../constants/ModalConstants';

class ModalUnlockWallet extends React.Component {

	onSuccess(e) {
		e.preventDefault();
		if (this.props.successCallback && typeof this.props.successCallback === 'function') {
			this.props.successCallback();
		}

		this.props.closeModal();
	}

	onCancel() {
		if (this.props.cancelCallback && typeof this.props.cancelCallback === 'function') {
			this.props.cancelCallback();
		}

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

	render() {
		const { show } = this.props;

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
									<input placeholder="Password" />
								</Form.Field>
							</div>
							<Button basic type="submit" color="orange" onClick={(e) => this.onSuccess(e)}>Unlock Wallet</Button>
							{/* FOR BUTTON WHITOUT LOADING:
								<Button type="submit" color="orange" className="load">Loading...</Button>
							*/}
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
	successCallback: PropTypes.func,
	cancelCallback: PropTypes.func,
	closeModal: PropTypes.func,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disableBackgroundClick: false,
	successCallback: () => {},
	cancelCallback: () => {},
	closeModal: () => {},
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_UNLOCK, 'show']),
		successCallback: state.modal.getIn([MODAL_UNLOCK, 'successCallback']),
		cancelCallback: state.modal.getIn([MODAL_UNLOCK, 'cancelCallback']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK)),
	}),
)(ModalUnlockWallet);

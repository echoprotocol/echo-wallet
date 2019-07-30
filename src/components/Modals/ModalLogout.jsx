import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';

import { MODAL_LOGOUT } from '../../constants/ModalConstants';
import { removeAccount } from '../../actions/GlobalActions';


class ModalLogout extends React.Component {

	onClose() {
		this.props.closeModal();
	}

	onConfirm() {
		const { accountName } = this.props;
		this.props.logout(accountName);
		this.props.closeModal();
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
						<Form className="main-form">
							<div className="form-info">
								<h3>Confirm logout</h3>
							</div>
							You will be signed out of your account.
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									basic
									type="button"
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
	accountName: PropTypes.string.isRequired,
	logout: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_LOGOUT, 'show']),
		accountName: state.modal.getIn([MODAL_LOGOUT, 'accountName']),
	}),
	(dispatch) => ({
		logout: (accountName) => dispatch(removeAccount(accountName)),
		closeModal: () => dispatch(closeModal(MODAL_LOGOUT)),
	}),
)(ModalLogout);

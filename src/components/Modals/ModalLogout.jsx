import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';

import { MODAL_LOGOUT } from '../../constants/ModalConstants';
import { logout } from '../../actions/GlobalActions';


class ModalLogout extends React.Component {

	onClose() {
		this.props.closeModal();
	}

	onConfirm() {
		this.props.logout();
		this.props.closeModal();
	}

	render() {
		const { show, accounts } = this.props;

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
							{ accounts.length < 2 ? 'You will be signed out of your account.' : 'You will be signed out of all your accounts.' }


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
	logout: PropTypes.func.isRequired,
	accounts: PropTypes.array.isRequired,
	closeModal: PropTypes.func.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_LOGOUT, 'show']),
		accounts: state.balance.get('preview').toJS(),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		closeModal: () => dispatch(closeModal(MODAL_LOGOUT)),
	}),
)(ModalLogout);

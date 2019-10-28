import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_CONFIRM_EDITING_OF_PERMISSIONS } from '../../constants/ModalConstants';


class ModalConfirmEditingOfPermissions extends React.Component {

	onClose() {
		this.props.close();
	}

	render() {
		const { show } = this.props;

		return (
			<Modal className="confirm-editing-of-permissions-modal" open={show} dimmer="inverted">

				<div className="modal-header">
					<h3 className="modal-header-title">Please, confirm applying changes</h3>
				</div>
				<div className="modal-body">
					<div className="info-text">
						I understand that uncontrolled changes may lead to loosing access
						to my wallet or restrict my actions within it.
					</div>
					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => {}}
							content="Back to edit mode"
						/>
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => {}}
							content="Confirm"
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalConfirmEditingOfPermissions.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalConfirmEditingOfPermissions.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CONFIRM_EDITING_OF_PERMISSIONS, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_CONFIRM_EDITING_OF_PERMISSIONS)),
	}),
)(ModalConfirmEditingOfPermissions);


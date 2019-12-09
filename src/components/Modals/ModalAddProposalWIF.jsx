import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { PERMISSIONS_PATH } from '../../constants/RouterConstants';
import { PROPOSAL_ADD_WIF } from '../../constants/ModalConstants';
import { closeModal } from '../../actions/ModalActions';

class ModalWIF extends React.Component {

	onAgree(e) {
		e.preventDefault();
		this.props.history.push(PERMISSIONS_PATH);
		this.props.hide();
	}
	onClose(e) {
		e.preventDefault();
		this.props.hide();
	}

	render() {
		const { show } = this.props;

		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content add-key">
						<div className="modal-header">Would you like to add other keys now?</div>
						<div className="modal-body">
							<div className="info-text">
							Your account settings require more than one key to sign a transaction. <br />
							You can add more keys now or later on the Backup and Permissions page.
							</div>
							<div className="form-panel">
								<Button
									type="button"
									className="main-btn"
									onClick={(e) => this.onClose(e)}
									content="Do it later"
								/>
								<Button
									type="button"
									className="main-btn"
									onClick={(e) => this.onAgree(e)}
									content="Proceed"
								/>
							</div>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalWIF.propTypes = {
	show: PropTypes.bool,
	hide: PropTypes.func.isRequired,
	history: PropTypes.any.isRequired,
};

ModalWIF.defaultProps = {
	show: false,
};

export default withRouter(connect(
	(state) => ({
		show: state.modal.getIn([PROPOSAL_ADD_WIF, 'show']),
	}),
	(dispatch) => ({
		hide: () => dispatch(closeModal(PROPOSAL_ADD_WIF)),
	}),
)(ModalWIF));

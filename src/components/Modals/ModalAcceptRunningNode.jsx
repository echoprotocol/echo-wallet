import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ACCEPT_RUNNING_NODE } from '../../constants/ModalConstants';

class ModalAcceptRunningNode extends React.Component {

	onClose() {
		this.props.close();
	}

	render() {
		const { show } = this.props;
		return (
			<Modal
				className="modal-wrap"
				open={show}
			>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={() => this.onClose()}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							Run local node
						</h2>
					</div>
					<div className="modal-body accept-running-node">
						<div className="info-text">
							You need to accept incoming network connections<br />
							so as to run local node
						</div>
						<form className="form-panel">
							<button
								className="main-btn"
								onClick={(e) => this.onClose(e)}
							>Dismiss
							</button>
							<button
								className="main-btn"
								onClick={(e) => this.onConfirm(e)}
							>Accept
							</button>
						</form>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalAcceptRunningNode.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalAcceptRunningNode.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ACCEPT_RUNNING_NODE, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ACCEPT_RUNNING_NODE)),
	}),
)(ModalAcceptRunningNode);


import React from 'react';
import { Modal, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ACCEPT_RUNNING_NODE } from '../../constants/ModalConstants';
import UnlockScenario from '../../containers/UnlockScenario';
import { startLocalNode } from '../../actions/GlobalActions';

class ModalAcceptRunningNode extends React.Component {

	onClose() {
		this.props.close();
	}

	onAccept(pass) {
		this.props.close();
		this.props.startLocalNode(pass);
	}

	render() {
		const { show, intl } = this.props;
		return (
			<UnlockScenario
				onUnlock={(pass) => this.onAccept(pass)}
			>
				{
					(submit) => (
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
										{intl.formatMessage({ id: 'modals.modal_accept_running_node.title' })}
									</h2>
								</div>
								<div className="modal-body accept-running-node">
									<div className="info-text">
										{intl.formatMessage({ id: 'modals.modal_accept_running_node.text_pt1' })}
										<br />
										{intl.formatMessage({ id: 'modals.modal_accept_running_node.text_pt2' })}
									</div>
									<Form className="form-panel">
										<button
											className="main-btn"
											onClick={(e) => this.onClose(e)}
										>
											{intl.formatMessage({ id: 'modals.modal_accept_running_node.button_dismiss_text' })}
										</button>
										<button
											className="main-btn"
											onClick={() => submit('run')}
										>
											{intl.formatMessage({ id: 'modals.modal_accept_running_node.button_confirm_text' })}
										</button>
									</Form>
								</div>
							</FocusLock>
						</Modal>
					)
				}
			</UnlockScenario>
		);
	}

}

ModalAcceptRunningNode.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	startLocalNode: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalAcceptRunningNode.defaultProps = {
	show: false,
};


export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ACCEPT_RUNNING_NODE, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ACCEPT_RUNNING_NODE)),
		startLocalNode: (pass) => dispatch(startLocalNode(pass)),
	}),
)(ModalAcceptRunningNode));


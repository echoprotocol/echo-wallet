import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ACCEPT_INCOMING_CONNECTIONS } from '../../constants/ModalConstants';
import icAccept from '../../assets/images/ic-accept.svg';
import UnlockScenario from '../../containers/UnlockScenario';
import { startLocalNode } from '../../actions/GlobalActions';

class ModalAcceptIncomingConnections extends React.Component {

	onClose(e) {
		e.preventDefault();
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
									onClick={(e) => this.onClose(e)}
								/>
								<div className="modal-header">
									<h2 className="modal-header-title">
										{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.title_pt1' })}
										<br />
										{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.title_pt2' })}
									</h2>
								</div>
								<div className="accept-connections modal-body">
									<h3 className="accept-connections-title">
										{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.subtitle_pt1' })}
										<br />
										<span className="bold">
											{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.subtitle_pt2' })}
										</span>
									</h3>
									<ul className="accept-connections-list">
										<li>
											<img src={icAccept} alt="" />
											<span className="list-item-content">
												{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.list_pt1' })}
											</span>
										</li>
										<li>
											<img src={icAccept} alt="" />
											<span className="list-item-content">
												{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.list_pt2' })}
											</span>
										</li>
										<li>
											<img src={icAccept} alt="" />
											<span className="list-item-content">
												{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.list_pt3' })}
											</span>
										</li>
										<li>
											<img src={icAccept} alt="" />
											<span className="list-item-content">
												{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.list_pt4_1' })}
												<br />
												{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.list_pt4_2' })}
											</span>
										</li>
									</ul>

									<div className="accept-connections-hint">
										{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.footer' })}
									</div>
									<div className="form-panel">
										<button className="transparet-btn grey" onClick={() => this.props.close()}>
											{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.button_dismiss_text' })}
										</button>
										<button autoFocus className="blue-btn" onClick={() => submit('income')}>
											{intl.formatMessage({ id: 'modals.modal_accept_incoming_connection.button_confirm_text' })}
										</button>
									</div>
								</div>
							</FocusLock>
						</Modal>
					)
				}
			</UnlockScenario>
		);
	}

}

ModalAcceptIncomingConnections.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	startLocalNode: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalAcceptIncomingConnections.defaultProps = {
	show: false,
};


export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ACCEPT_INCOMING_CONNECTIONS, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ACCEPT_INCOMING_CONNECTIONS)),
		startLocalNode: (pass) => dispatch(startLocalNode(pass)),
	}),
)(ModalAcceptIncomingConnections));


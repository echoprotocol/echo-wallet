import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ACCEPT_INCOMING_CONNECTIONS } from '../../constants/ModalConstants';
import icAccept from '../../assets/images/ic-accept.svg';

class ModalInfoWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
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
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							Do you want the application “Echo Wallet”<br />
							to accept incoming network connections?
						</h2>
					</div>
					<div className="accept-connections modal-body">
						<h3 className="accept-connections-title">
							Accept incoming network connections and <br />
							<span className="bold">enjoy all the benefits of running local node *</span>
						</h3>
						<ul className="accept-connections-list">
							<li>
								<img src={icAccept} alt="" />
								<span className="list-item-content">Become consensus participant</span>
							</li>
							<li>
								<img src={icAccept} alt="" />
								<span className="list-item-content">Earn block rewards</span>
							</li>
							<li>
								<img src={icAccept} alt="" />
								<span className="list-item-content">Generate new ECHO accounts</span>
							</li>
							<li>
								<img src={icAccept} alt="" />
								<span className="list-item-content">
									Run on your PC locally and<br /> safeguard your connection
								</span>
							</li>
						</ul>

						<div className="accept-connections-hint">
							* This setting can be changed in the Firewall pane of Security
							& Privacy preferences anytime.
						</div>
						<div className="form-panel">
							<button className="transparet-btn grey">Dismiss</button>
							<button autoFocus className="blue-btn">
								CONFIRM
							</button>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalInfoWallet.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalInfoWallet.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ACCEPT_INCOMING_CONNECTIONS, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ACCEPT_INCOMING_CONNECTIONS)),
	}),
)(ModalInfoWallet);


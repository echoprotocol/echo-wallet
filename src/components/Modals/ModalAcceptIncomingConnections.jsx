/* eslint-disable no-undef */
import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ACCEPT_INCOMING_CONNECTIONS } from '../../constants/ModalConstants';

class ModalInfoWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	render() {
		const { show } = this.props;
		return (
			<Modal className="accept-incoming-connections" open>
				<FocusLock autoFocus={false}>
					<div className="modal-content">
						<button
							className="icon-close"
							onClick={(e) => this.onClose(e)}
						/>
						<div className="modal-header">
							Do you want the application “Echo Wallet” to accept incoming network connections?
						</div>
						<div className="modal-body">

							dd
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


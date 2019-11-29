import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { watchContractAsToken } from '../../actions/BalanceActions';
import { closeModal, openModal } from '../../actions/ModalActions';

import { MODAL_WATCH_CONTRACT_AS_TOKEN } from '../../constants/ModalConstants';

class ModalWatchContractAsToken extends React.Component {

	onClose() {
		this.props.closeModal(MODAL_WATCH_CONTRACT_AS_TOKEN);
	}

	onConfirm() {
		const { contractId } = this.props;

		this.props.watchContractAsToken(contractId);
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
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>
									Do you want to add
									ERC20 token to watch list?
								</h3>
							</div>
							<div className="form-panel">
								<Button
									className="main-btn"
									onClick={() => this.onClose()}
									content="No"
								/>
								<Button
									type="submit"
									className="main-btn"
									onClick={() => this.onConfirm()}
									content="Yes"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWatchContractAsToken.propTypes = {
	show: PropTypes.bool,
	contractId: PropTypes.string.isRequired,
	closeModal: PropTypes.func.isRequired,
	watchContractAsToken: PropTypes.func.isRequired,
};

ModalWatchContractAsToken.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_WATCH_CONTRACT_AS_TOKEN, 'show']),
		contractId: state.modal.getIn([MODAL_WATCH_CONTRACT_AS_TOKEN, 'contractId']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
		openModal: (modal) => dispatch(openModal(modal)),
		watchContractAsToken: (accountId, contractId) =>
			dispatch(watchContractAsToken(accountId, contractId)),
	}),
)(ModalWatchContractAsToken);

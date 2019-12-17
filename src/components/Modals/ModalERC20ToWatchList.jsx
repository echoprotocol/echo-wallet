import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import FocusLock from 'react-focus-lock';

import { closeModal } from '../../actions/ModalActions';
import { watchContractAsToken } from '../../actions/BalanceActions';

import { MODAL_ERC20_TO_WATCH_LIST } from '../../constants/ModalConstants';

class ModalERC20ToWatchList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal(MODAL_ERC20_TO_WATCH_LIST);
	}

	onConfirm(e) {
		e.preventDefault();

		const { contractId } = this.props;

		this.props.watchContractAsToken(contractId);
	}

	render() {
		const {
			show,
		} = this.props;

		return (
			<Modal className="erc20-to-watch-list-modal" open={show} dimmer="inverted">
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>

					<div className="modal-header">
						<h3 className="modal-header-title">Do you want to add ERC20 token to watch list?</h3>
					</div>
					<div className="modal-body">
						<div className="form-panel">
							<Button
								className="main-btn"
								content="No"
								onClick={(e) => this.onClose(e)}
							/>
							<Button
								className="main-btn"
								content="Yes"
								onClick={(e) => this.onConfirm(e)}
							/>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}


ModalERC20ToWatchList.propTypes = {
	show: PropTypes.bool,
	contractId: PropTypes.string.isRequired,
	closeModal: PropTypes.func.isRequired,
	watchContractAsToken: PropTypes.func.isRequired,
};

ModalERC20ToWatchList.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ERC20_TO_WATCH_LIST, 'show']),
		contractId: state.modal.getIn([MODAL_ERC20_TO_WATCH_LIST, 'contractId']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
		watchContractAsToken: (accountId, contractId) =>
			dispatch(watchContractAsToken(accountId, contractId)),
	}),
)(ModalERC20ToWatchList);

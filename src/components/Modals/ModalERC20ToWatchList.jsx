import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
		this.props.closeModal();
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
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<h3 className="modal-header-title">Do you want to add ERC20 token to watch list?</h3>
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

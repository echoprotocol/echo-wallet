import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/ModalActions';

import { MODAL_BLACKLIST, MODAL_TO_BLACKLIST } from '../../constants/ModalConstants';
import Avatar from '../Avatar';
import ActionBtn from '../../components/ActionBtn';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import { REMOVE_FROM_BLACKLIST } from '../../constants/ContractsConstants';

class ModalBalcklist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onOpenAddModal(e) {
		e.preventDefault();
		this.props.closeModal();
		this.props.openAddModal();
	}

	renderList() {
		const { blacklist, owner, activeUser } = this.props;
		return blacklist.map((el) => (
			<button className="segment">
				<Avatar accountName={el.name} />
				<div className="name">{el.name}</div>
				{ owner === activeUser && <ActionBtn
					icon="remove"
					text="Remove"
					onClick={this.props.removeFromBlackList(el.id)}
				/>}
			</button>
		));
	}

	render() {
		const {
			show, owner, activeUser,
		} = this.props;

		return (
			<Modal className="whitelist-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Blacklist</h3>
				</div>
				<div className="modal-body">
					<div className="segments">
						{this.renderList()}
					</div>
					<div className="form-panel">
						{ owner === activeUser && <Button
							className="main-btn"
							content="Add account"
							onClick={(e) => this.onOpenAddModal(e)}
						/>}
					</div>
				</div>
			</Modal>
		);
	}

}

ModalBalcklist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	openAddModal: PropTypes.func.isRequired,
	blacklist: PropTypes.array.isRequired,
	removeFromBlackList: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
};

ModalBalcklist.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		blacklist: state.contract.get('blacklist'),
		show: state.modal.getIn([MODAL_BLACKLIST, 'show']),
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		openAddModal: () => dispatch(openModal(MODAL_TO_BLACKLIST)),
		closeModal: () => dispatch(closeModal(MODAL_BLACKLIST)),
		removeFromBlackList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, REMOVE_FROM_BLACKLIST)),
	}),
)(ModalBalcklist);

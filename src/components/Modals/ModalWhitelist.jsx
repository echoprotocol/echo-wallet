import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/ModalActions';

import { MODAL_WHITELIST, MODAL_TO_WHITELIST } from '../../constants/ModalConstants';
import Avatar from '../Avatar';
import ActionBtn from '../../components/ActionBtn';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import { REMOVE_FROM_WHITELIST } from '../../constants/ContractsConstants';

class ModalWhitelist extends React.Component {

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
		const { whitelist, owner, activeUser } = this.props;
		return whitelist.map((el) => (
			<button className="segment">
				<Avatar accountName={el.name} />
				<div className="name">{el.name}</div>
				{ owner === activeUser && <ActionBtn
					icon="remove"
					text="Remove"
					onClick={this.props.removeFromWhiteList(el.id)}
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
					<h3 className="modal-header-title">Whitelist</h3>
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

ModalWhitelist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	whitelist: PropTypes.array.isRequired,
	openAddModal: PropTypes.func.isRequired,
	removeFromWhiteList: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
};

ModalWhitelist.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		whitelist: state.contract.get('whitelist'),
		show: state.modal.getIn([MODAL_WHITELIST, 'show']),
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		openAddModal: () => dispatch(openModal(MODAL_TO_WHITELIST)),
		closeModal: () => dispatch(closeModal(MODAL_WHITELIST)),
		removeFromWhiteList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, REMOVE_FROM_WHITELIST)),
	}),
)(ModalWhitelist);

import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { CACHE_MAPS } from 'echojs-lib';

import { closeModal, openModal } from '../../actions/ModalActions';
import { MODAL_WHITELIST, MODAL_TO_WHITELIST } from '../../constants/ModalConstants';
import Avatar from '../Avatar';
import ActionBtn from '../../components/ActionBtn';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';

class ModalWhitelist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			el: null,
		};
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

	renderList(submit) {
		const {
			contracts, owner, activeUser, contractId, accounts, intl,
		} = this.props;
		if (!contracts.get(contractId)) {
			return [];
		}
		const whitelist = contracts.getIn([contractId, 'whitelist']);
		return whitelist ? whitelist.map((el) => (

			<div className="segment">
				<Avatar accountName={accounts.getIn([el, 'name'])} />
				<div className="name">{accounts.getIn([el, 'name'])}</div>
				{owner === activeUser && <ActionBtn
					icon="remove"
					text={intl.formatMessage({ id: 'modals.modal_whitelist.remove_button_text' })}
					action={() => {
						this.setState({ el }, () => submit());
					}}
				/>}
			</div>

		)).toArray() : [];
	}

	render() {
		const {
			show, owner, activeUser, intl,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.removeFromWhiteList(this.state.el)}
			>
				{
					(submit) => (
						<Modal className="whitelist-modal" open={show}>
							<button
								className="icon-close"
								onClick={(e) => this.onClose(e)}
							/>
							<div className="modal-header">
								<h3 className="modal-header-title">
									{intl.formatMessage({ id: 'modals.modal_whitelist.title' })}
								</h3>
							</div>
							<div className="modal-body">
								<div className="segments">
									{this.renderList(submit)}
								</div>
								<div className="form-panel">
									{owner === activeUser && <Button
										className="main-btn"
										content={intl.formatMessage({ id: 'modals.modal_whitelist.add_button_text' })}
										onClick={(e) => this.onOpenAddModal(e)}
									/>}
								</div>
							</div>
						</Modal>)
				}
			</TransactionScenario>
		);
	}

}

ModalWhitelist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	contracts: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	openAddModal: PropTypes.func.isRequired,
	removeFromWhiteList: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalWhitelist.defaultProps = {
	show: false,
};

export default injectIntl(connect(
	(state) => ({
		contracts: state.echojs.get(CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID),
		accounts: state.echojs.get(CACHE_MAPS.ACCOUNTS_BY_ID),
		show: state.modal.getIn([MODAL_WHITELIST, 'show']),
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		openAddModal: () => dispatch(openModal(MODAL_TO_WHITELIST)),
		closeModal: () => dispatch(closeModal(MODAL_WHITELIST)),
		removeFromWhiteList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_WHITELIST)),
	}),
)(ModalWhitelist));

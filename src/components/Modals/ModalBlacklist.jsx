import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CACHE_MAPS } from 'echojs-lib';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal, openModal } from '../../actions/ModalActions';
import { MODAL_BLACKLIST, MODAL_TO_BLACKLIST } from '../../constants/ModalConstants';
import Avatar from '../Avatar';
import ActionBtn from '../../components/ActionBtn';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';

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
		const {
			contracts, contractId, owner, activeUser, accounts, intl,
		} = this.props;
		if (!contracts.get(contractId)) {
			return [];
		}
		const removeBtnTxt = intl.formatMessage({ id: 'modals.modal_blacklist.remove_button_text' });

		const blacklist = contracts.getIn([contractId, 'blacklist']);
		return blacklist ? blacklist.map((el, i) => (
			<TransactionScenario
				handleTransaction={() => this.props.removeFromBlackList(el)}
				key={i.toString()}
			>
				{
					(submit) => (
						<div className="segment">
							<Avatar accountName={accounts.getIn([el, 'name'])} />
							<div className="name">{accounts.getIn([el, 'name'])}</div>
							{ owner === activeUser && <ActionBtn
								icon="remove"
								text={removeBtnTxt}
								action={() => submit()}
							/>}
						</div>
					)
				}
			</TransactionScenario>
		)).toArray() : [];
	}

	render() {
		const {
			show, owner, activeUser, intl,
		} = this.props;

		return (
			<Modal className="whitelist-modal" open={show} dimmer="inverted">
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_blacklist.title' })}
						</h2>
					</div>
					<div className="modal-body">
						<div className="segments">
							{this.renderList()}
						</div>
						<div className="form-panel">
							{ owner === activeUser && <Button
								className="main-btn"
								content={intl.formatMessage({ id: 'modals.modal_blacklist.add_button_text' })}
								onClick={(e) => this.onOpenAddModal(e)}
							/>}
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalBalcklist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	openAddModal: PropTypes.func.isRequired,
	contracts: PropTypes.object.isRequired,
	accounts: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	removeFromBlackList: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalBalcklist.defaultProps = {
	show: false,
};

export default injectIntl(connect(
	(state) => ({
		contracts: state.echojs.get(CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID),
		accounts: state.echojs.get(CACHE_MAPS.ACCOUNTS_BY_ID),
		show: state.modal.getIn([MODAL_BLACKLIST, 'show']),
		owner: state.contract.get('owner'),
		activeUser: state.global.getIn(['activeUser', 'id']),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		openAddModal: () => dispatch(openModal(MODAL_TO_BLACKLIST)),
		closeModal: () => dispatch(closeModal(MODAL_BLACKLIST)),
		removeFromBlackList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_BLACKLIST)),
	}),
)(ModalBalcklist));

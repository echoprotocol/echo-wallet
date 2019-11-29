import React from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { getAccountsList } from '../../actions/AccountActions';

import { MODAL_CHANGE_PARENT_ACCOUNT } from '../../constants/ModalConstants';
import Avatar from '../Avatar';

import TransactionScenario from '../../containers/TransactionScenario';


class ModalLogout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			loading: false,
			accounts: [],
		};
	}

	onClose() {
		this.props.closeModal(MODAL_CHANGE_PARENT_ACCOUNT);
	}

	onChangeAccount(account) {
		// this.props.setValue('supportedAsset', assetSymbol);
		this.setState({ searchText: account });
	}

	onResetAccount() {
		this.setState({
			searchText: '',
		});
		// this.props.setValue('supportedAsset', '');
	}

	async accountSearchHandler(e, data) {
		this.setState({
			searchText: data.searchQuery,
			loading: true,
		});
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.setState({
			timeout: setTimeout(async () => {
				const accounts = (await getAccountsList(data.searchQuery))
					.map(([name, id]) => ({
						key: name,
						text: name,
						value: id,
					}));
				this.setState({
					accounts,
					loading: false,
				});
			}, 300),
		});
	}

	renderList() {
		const { accounts } = this.state;
		return accounts.map(({ key, text, value }) => {
			const content = (
				<button
					key={key}
					className="user-item"
					onClick={() => this.onChangeAccount(text)}
				>
					<div className="avatar-wrap">
						<Avatar accountName={text} />
					</div>

					<div className="name">{text}</div>

				</button>

			);

			return ({ value, key, content });
		});
	}

	render() {
		const { show, currentAccountName } = this.props;
		const { searchText, loading } = this.state;
		console.log('render list', this.renderList());
		return (
			<Modal
				className="change-parent-account-modal"
				open={show}
				dimmer="inverted"
			>
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Change delegate</h3>
				</div>
				<div className="modal-body">
					<div className="field-wrap">
						<Form.Field>
							<label htmlFor="current-account">Current Account</label>
							<div className="image-input">
								<Avatar accountName={currentAccountName} />
								<input
									type="text"
									name="current-account"
									disabled
									className="ui input"
									value={currentAccountName}
								/>
							</div>
						</Form.Field>
						<div className="field">

							<label htmlFor="parentAccount" className="field-label">Delegated to</label>
							<div className="account-dropdown-wrap">
								<Avatar accountName="account-name" />
								<Dropdown
									options={(searchText && !loading) ? this.renderList() : []}
									searchQuery={searchText}
									search
									selection
									fluid
									name="parentAccount"
									text={searchText || 'Delegated to'}
									onSearchChange={(e, data) => this.accountSearchHandler(e, data)}
									placeholder="Delegated to"
									selectOnNavigation={false}
									minCharacters={0}
									noResultsMessage="No results are found"
								/>
							</div>
						</div>
					</div>
					<div className="form-panel">
						<TransactionScenario handleTransaction={() => {}}>
							{
								(submit) => (
									<Button
										type="submit"
										className="main-btn"
										content="Confirm"
										onClick={submit}
										disabled={loading}
									/>
								)
							}
						</TransactionScenario>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalLogout.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	currentAccountName: PropTypes.string.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CHANGE_PARENT_ACCOUNT, 'show']),
		currentAccountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
	}),
)(ModalLogout);

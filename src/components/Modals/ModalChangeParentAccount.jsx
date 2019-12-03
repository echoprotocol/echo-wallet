import React from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { closeModal } from '../../actions/ModalActions';
import { lookupAccountsList } from '../../actions/AccountActions';
import { changeDelegate } from '../../actions/TransactionActions';

import { MODAL_CHANGE_PARENT_ACCOUNT } from '../../constants/ModalConstants';
import Avatar from '../Avatar';

import TransactionScenario from '../../containers/TransactionScenario';


class ModalLogout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
			loading: false,
			options: [],
			timeout: null,
		};
	}

	onClose() {
		this.props.closeModal(MODAL_CHANGE_PARENT_ACCOUNT);
	}

	onChangeAccount(accountId) {
		const accountName = this.state.options.find(({ value }) => value === accountId) || {};
		this.setState({ searchText: accountName.text });
	}

	async accountSearchHandler(e, data) {
		const searchText = data.searchQuery;
		this.setState({
			searchText,
			loading: true,
		});
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
		this.setState({
			timeout: setTimeout(async () => {
				const options = searchText ? (await lookupAccountsList(searchText, 2))
					.map(([name, id]) => ({
						key: id,
						text: name,
						value: id,
					})) : [];
				this.setState({
					options,
					loading: false,
				});
			}, 300),
		});
	}

	async submit(delegate) {
		await this.props.changeDelegate(delegate && delegate.value);
		this.onClose();
	}

	renderList(options) {
		return options.map(({ key, text, value }) => {
			const content = (
				<button
					className="user-item"
					onClick={() => this.onChangeAccount(value)}
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
		const { searchText, loading, options } = this.state;

		const delegate = options.find(({ text }) => text === searchText);

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
								{
									delegate ? <Avatar accountName={searchText} /> : <Avatar />
								}
								<Dropdown
									className={classnames({ empty: !searchText || loading })}
									options={(searchText && !loading) ? this.renderList(options) : []}
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
									noResultsMessage={searchText ? 'No results are found' : null}
									onChange={(e, { value }) => this.onChangeAccount(value)}
								/>
							</div>
						</div>
					</div>
					<div className="form-panel">
						<TransactionScenario
							handleTransaction={() => this.submit(delegate)}
						>
							{
								(submit) => (
									<Button
										type="submit"
										className="main-btn"
										content="Confirm"
										onClick={submit}
										disabled={loading || !delegate}
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
	changeDelegate: PropTypes.func.isRequired,
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
		changeDelegate: (delegateId) => dispatch(changeDelegate(delegateId)),
	}),
)(ModalLogout);

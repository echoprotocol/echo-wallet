import React from 'react';
import { Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';

import { MODAL_CHANGE_PARENT_ACCOUNT } from '../../constants/ModalConstants';
import Avatar from '../Avatar';

class ModalLogout extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchText: '',
		};
	}

	onClose() {
		this.props.closeModal(MODAL_CHANGE_PARENT_ACCOUNT);
	}

	accountSearchHandler(e, data) {
		this.setState({
			searchText: data.searchQuery,
		});
	}

	renderList() {
		const accounts = [{ name: 'ac1' }, { name: 'ac2' }, { name: 'ac3' }];
		return accounts.map(({ name }) => {
			const content = (
				<button
					key={name}
					className="user-item"
					onClick={() => this.onChangeAccount(name)}
				>
					<div className="avatar-wrap">
						<Avatar accountName={name} />
					</div>

					<div className="name">{name}</div>

				</button>

			);

			return ({
				value: name,
				key: name,
				content,
			});
		});
	}

	render() {
		const { show } = this.props;
		const { searchText } = this.state;

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
					<h3 className="modal-header-title">Change parent account</h3>
				</div>
				<div className="modal-body">
					<div className="field-wrap">
						<Form.Field>
							<label htmlFor="current-account">Current Account</label>
							<div className="image-input">
								<Avatar accountName="account-name" />
								<input
									type="text"
									name="current-account"
									disabled
									className="ui input"
									value="account-name"
								/>
							</div>
						</Form.Field>
						<div className="field">

							<label htmlFor="parentAccount" className="field-label">Parent account</label>
							<div className="account-dropdown-wrap">
								<Avatar accountName="account-name" />
								<Dropdown
									options={this.renderList()}
									searchQuery={searchText}
									search
									selection
									fluid
									name="parentAccount"
									text={searchText || 'Parent account'}
									onSearchChange={(e, data) => this.accountSearchHandler(e, data)}
									placeholder="Parent account"
									selectOnNavigation={false}
									minCharacters={0}
									noResultsMessage="No results are found"
								/>
							</div>
						</div>
					</div>
					<div className="form-panel">
						<Button
							type="submit"
							className="main-btn"
							content="Confirm"
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalLogout.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ModalLogout.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CHANGE_PARENT_ACCOUNT, 'show']),
	}),
	(dispatch) => ({
		closeModal: (modal) => dispatch(closeModal(modal)),
	}),
)(ModalLogout);

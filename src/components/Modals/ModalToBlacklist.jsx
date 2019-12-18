import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

import { closeModal } from '../../actions/ModalActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { MODAL_TO_BLACKLIST } from '../../constants/ModalConstants';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import { checkAccount } from '../../actions/AccountActions';
import Avatar from '../../components/Avatar';
import { FORM_BLACKLIST } from '../../constants/FormConstants';
import { setIn } from '../../actions/FormActions';
import VerificationField from '../Fields/VerificationField';

class ModalToBlacklist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			timeout: null,
		};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInputChange(value) {

		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const trimedValue = value.trim();


		this.checkInput(trimedValue);
	}

	onAdd(submit) {
		submit();
	}

	getStatus(field) {

		if (field.error) {
			return 'error';
		}

		if (field.checked) {
			return 'checked';
		}

		return null;
	}

	checkInput(value) {
		this.props.setIn('account', {
			loading: true,
			error: null,
			checked: false,
			value,
		});

		this.setState({
			timeout: setTimeout(async () => {
				await this.props.checkAccount(this.props.account.value, 'account');
			}, 300),
		});
	}

	isAvatar() {
		const { account } = this.props;

		if (account.checked && !account.error) {
			return true;
		}

		return false;
	}

	render() {
		const {
			show, account,
		} = this.props;

		const icon = this.isAvatar() &&
			<div className="avatar-wrap">
				<Avatar accountName={account.value} />
			</div>;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToBlackList(account.value)}
			>
				{
					(submit) => (
						<Modal className="to-blacklist-modal" open={show} dimmer="inverted">
							<FocusLock autoFocus={false}>
								<button
									className="icon-close"
									onClick={(e) => this.onClose(e)}
								/>
								<div className="modal-header">
									<h3 className="modal-header-title">Add account to blacklist</h3>
								</div>
								<Form className="modal-body">
									<div className="field-wrap">
										<VerificationField
											label="Account Name"
											name="account-name"
											onChange={(value) => this.onInputChange(value)}
											value={account.value}
											autoFocus
											icon={icon}
											status={this.getStatus(account)}
											error={account.error}
											loading={account.loading && !account.error}
											placeholder="Account Name"
										/>
									</div>

									<div className="form-panel">
										<Button
											className="main-btn"
											content="Confirm"
											onClick={() => {
												this.onAdd(submit);
											}}
										/>
									</div>
								</Form>
							</FocusLock>
						</Modal>)
				}
			</TransactionScenario>
		);
	}

}

ModalToBlacklist.propTypes = {
	show: PropTypes.bool,
	account: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	addToBlackList: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
};

ModalToBlacklist.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		account: state.form.getIn([FORM_BLACKLIST, 'account']),
		show: state.modal.getIn([MODAL_TO_BLACKLIST, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_BLACKLIST)),
		addToBlackList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_TO_BLACKLIST, FORM_BLACKLIST, 'account')),
		setIn: (field, param) => dispatch(setIn(FORM_BLACKLIST, field, param)),
		checkAccount: (value, subject) => dispatch(checkAccount(FORM_BLACKLIST, value, subject)),
	}),
)(ModalToBlacklist);

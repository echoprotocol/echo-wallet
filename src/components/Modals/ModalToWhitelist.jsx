import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { MODAL_TO_WHITELIST } from '../../constants/ModalConstants';
import { FORM_WHITELIST } from '../../constants/FormConstants';
import { setIn } from '../../actions/FormActions';


import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';
import { checkAccount } from '../../actions/AccountActions';

import VerificationField from '../Fields/VerificationField';
import Avatar from '../../components/Avatar';

class ModalToWhitelist extends React.Component {

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
		const { show, account, intl } = this.props;

		const icon = this.isAvatar() &&
			<div className="avatar-wrap">
				<Avatar accountName={account.value} />
			</div>;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToWhiteList(account.value)}
			>
				{
					(submit) => (
						<Modal className="to-whitelist-modal" open={show} dimmer="inverted">
							<FocusLock autoFocus={false}>
								<button
									className="icon-close"
									onClick={(e) => this.onClose(e)}
								/>
								<div className="modal-header">
									<h3 className="modal-header-title">
										{intl.formatMessage({ id: 'modals.modal_to_whitelist.title' })}
									</h3>
								</div>
								<Form className="modal-body">
									<div className="field-wrap">
										<VerificationField
											label={intl.formatMessage({ id: 'modals.modal_to_whitelist.account_input.title' })}
											name="account-name"
											onChange={(value) => this.onInputChange(value)}
											value={account.value}
											autoFocus
											icon={icon}
											status={this.getStatus(account)}
											error={account.error}
											loading={account.loading && !account.error}
											placeholder={intl.formatMessage({ id: 'modals.modal_to_whitelist.account_input.placeholder' })}
											intl={intl}
										/>
									</div>
									<div className="form-panel">
										<Button
											type="submit"
											className="main-btn"
											content={intl.formatMessage({ id: 'modals.modal_to_whitelist.confirm_button_text' })}
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

ModalToWhitelist.propTypes = {
	account: PropTypes.object.isRequired,
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	addToWhiteList: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	setIn: PropTypes.func.isRequired,
	checkAccount: PropTypes.func.isRequired,
};

ModalToWhitelist.defaultProps = {
	show: false,
};

export default injectIntl(connect(
	(state) => ({
		account: state.form.getIn([FORM_WHITELIST, 'account']),
		show: state.modal.getIn([MODAL_TO_WHITELIST, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_WHITELIST)),
		addToWhiteList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_TO_WHITELIST, FORM_WHITELIST, 'account')),
		setIn: (field, param) => dispatch(setIn(FORM_WHITELIST, field, param)),
		checkAccount: (value, subject) => dispatch(checkAccount(FORM_WHITELIST, value, subject, true)),
	}),
)(ModalToWhitelist));

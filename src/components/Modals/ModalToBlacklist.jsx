import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal, setError } from '../../actions/ModalActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { MODAL_TO_BLACKLIST } from '../../constants/ModalConstants';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';

class ModalToBlacklist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			accountName: '',
		};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInputChange(e) {
		this.props.setError(null);
		const value = e.target.value.toLowerCase().trim();
		this.setState({ accountName: value });
	}
	onAdd(submit) {
		submit();
	}


	render() {
		const {
			show, error, intl,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToBlackList(this.state.accountName)}
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
									<h3 className="modal-header-title">
										{intl.formatMessage({ id: 'modals.modal_to_blacklist.title' })}
									</h3>
								</div>
								<div className="modal-body">
									<Form.Field className={classnames('error-wrap', { error: !!error })}>
										<label htmlFor="account-name">
											{intl.formatMessage({ id: 'modals.modal_to_blacklist.account_input.title' })}
										</label>
										<input
											type="text"
											placeholder={intl.formatMessage({ id: 'modals.modal_to_blacklist.account_input.placeholder' })}
											name="account-name"
											onChange={(e) => this.onInputChange(e)}
											autoFocus
										/>
										{
											<span className="error-message">
												{
													error ? intl.formatMessage({ id: error }) : null
												}
											</span>
										}
									</Form.Field>
									<div className="form-panel">
										<Button
											className="main-btn"
											content={intl.formatMessage({ id: 'modals.modal_to_blacklist.confirm_button_text' })}
											onClick={() => {
												this.onAdd(submit);
											}}
										/>
									</div>
								</div>
							</FocusLock>
						</Modal>)
				}
			</TransactionScenario>
		);
	}

}

ModalToBlacklist.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	addToBlackList: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalToBlacklist.defaultProps = {
	show: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_TO_BLACKLIST, 'show']),
		error: state.modal.getIn([MODAL_TO_BLACKLIST, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_BLACKLIST)),
		addToBlackList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_TO_BLACKLIST)),
		setError: (value) => dispatch(setError(MODAL_TO_BLACKLIST, value)),
	}),
)(ModalToBlacklist));

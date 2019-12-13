import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';

import { closeModal, setError } from '../../actions/ModalActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { MODAL_TO_WHITELIST } from '../../constants/ModalConstants';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';

class ModalToWhitelist extends React.Component {

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
		const value = e.target.value.trim();
		this.setState({ accountName: value });
	}
	onAdd(submit) {
		submit();
	}

	render() {
		const {
			show, error,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToWhiteList(this.state.accountName)}
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
									<h3 className="modal-header-title">Add account to whitelist</h3>
								</div>
								<div className="modal-body">
									<Form.Field className={classnames('error-wrap', { error: !!error })}>
										<label htmlFor="account-name">Account name</label>
										<input
											type="text"
											placeholder="Account name"
											name="account-name"
											onChange={(e) => this.onInputChange(e)}
											autoFocus
										/>
										{
											<span className="error-message">{error}</span>
										}
									</Form.Field>
									<div className="form-panel">
										<Button
											type="submit"
											className="main-btn"
											content="Confirm"
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

ModalToWhitelist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	error: PropTypes.string,
	addToWhiteList: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
};

ModalToWhitelist.defaultProps = {
	show: false,
	error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_TO_WHITELIST, 'show']),
		error: state.modal.getIn([MODAL_TO_WHITELIST, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_WHITELIST)),
		addToWhiteList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_TO_WHITELIST)),
		setError: (value) => dispatch(setError(MODAL_TO_WHITELIST, value)),
	}),
)(ModalToWhitelist);

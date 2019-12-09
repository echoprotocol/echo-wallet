import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FocusTrap from 'focus-trap-react';

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
			show, error,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToBlackList(this.state.accountName)}
			>
				{
					(submit) => (
						<Modal className="to-blacklist-modal" open={show} dimmer="inverted">
							<FocusTrap>
								<div className="focus-trap-wrap">
									<button
										className="icon-close"
										onClick={(e) => this.onClose(e)}
									/>
									<div className="modal-header">
										<h3 className="modal-header-title">Add account to blacklist</h3>
									</div>
									<div className="modal-body">
										<Form.Field className={classnames('error-wrap', { error: !!error })}>
											<label htmlFor="account-name">Account name</label>
											<input
												type="text"
												placeholder="Account name"
												name="account-name"
												onChange={(e) => this.onInputChange(e)}
											/>
											{
												<span className="error-message">{error}</span>
											}
										</Form.Field>
										<div className="form-panel">
											<Button
												className="main-btn"
												content="Confirm"
												onClick={() => {
													this.onAdd(submit);
												}}
											/>
										</div>
									</div>
								</div>
							</FocusTrap>
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
};

ModalToBlacklist.defaultProps = {
	show: false,
	error: null,
};

export default connect(
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
)(ModalToBlacklist);

import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { CACHE_MAPS } from 'echojs-lib';

import { closeModal, setError } from '../../actions/ModalActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { MODAL_TO_BLACKLIST } from '../../constants/ModalConstants';
import { contractChangeWhiteAndBlackLists } from '../../actions/TransactionActions';

class ModalToBlacklist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id: '',
		};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInputChange(e) {
		this.props.setError(null);
		const value = e.target.value.toLowerCase().trim();
		this.setState({ id: value });
	}
	onAdd(submit) {
		const { contracts, contractId } = this.props;
		if (!contracts.get(contractId)) {
			return;
		}
		if (contracts.getIn([contractId, 'blacklist']).some((el) => el.id === this.state.id)) {
			this.props.setError('This address already exists in blacklist');
			return;
		}
		this.props.closeModal();
		submit();
	}


	render() {
		const {
			show, error,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.addToBlackList(this.state.id)}
			>
				{
					(submit) => (
						<Modal className="to-blacklist-modal" open={show} dimmer="inverted">
							<span
								className="icon-close"
								onClick={(e) => this.onClose(e)}
								onKeyDown={(e) => this.onClose(e)}
								role="button"
								tabIndex="0"
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
						</Modal>)
				}
			</TransactionScenario>
		);
	}

}

ModalToBlacklist.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	contracts: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
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
		contracts: state.echojs.get(CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_BLACKLIST)),
		addToBlackList: (accId) =>
			dispatch(contractChangeWhiteAndBlackLists(accId, MODAL_TO_BLACKLIST)),
		setError: (value) => dispatch(setError(MODAL_TO_BLACKLIST, value)),
	}),
)(ModalToBlacklist);

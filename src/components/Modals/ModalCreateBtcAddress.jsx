import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import FocusLock from 'react-focus-lock';

import { closeModal, setError } from '../../actions/ModalActions';
import { MODAL_GENERATE_BTC_ADDRESS } from '../../constants/ModalConstants';
import { generateBtcAddress } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { isBackupAddress } from '../../helpers/ValidateHelper';

class ModalCreateBtcAddress extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			address: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	onGenerateBtcAddress(submit) {
		if (!isBackupAddress(this.state.address)) {
			this.props.setError('Wrong backup address');
			return;
		}
		this.props.closeModal();
		submit();
	}
	onChange(e) {
		this.props.setError(null);
		this.setState({ address: e.target.value });
	}
	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}


	render() {
		const {
			show, error,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.generateBtcAddress(this.state.address)}
			>
				{
					(submit) => (
						<Modal className="create-address-modal" open={show}>
							<FocusLock autoFocus={false}>
								<button
									className="icon-close"
									onClick={(e) => this.onClose(e)}
								/>
								<div className="modal-header">
									<h3 className="modal-header-title">Create BTC address</h3>
								</div>
								<Form className="modal-body">
									<div className="info-text">
											To create your new BTC Address, please,
											provide your external backup BTC address.
											Backup BTC address is needed to be able to withhold a sent transaction to
											ECHO network during the first 24 hours after the transaction being made.
									</div>

									<Form.Field className={classnames('error-wrap', { error: !!error })}>
										<label htmlFor="address">Backup address</label>
										<input
											type="text"
											placeholder="Backup address"
											name="address"
											onChange={(e) => this.onChange(e)}
											autoFocus
										/>
										{
											<span className="error-message">{error}</span>
										}
										<span className="warning-message">
												Submit your backup BTC address above.
										</span>
									</Form.Field>
									<div className="form-panel">
										<Button
											className="main-btn countdown-wrap"
											content="Generate address"
											onClick={() => {
												this.onGenerateBtcAddress(submit);
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

ModalCreateBtcAddress.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	generateBtcAddress: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
};

ModalCreateBtcAddress.defaultProps = {
	show: false,
	error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_BTC_ADDRESS, 'show']),
		error: state.modal.getIn([MODAL_GENERATE_BTC_ADDRESS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_BTC_ADDRESS)),
		generateBtcAddress: (address) => dispatch(generateBtcAddress(address)),
		setError: (value) => dispatch(setError(MODAL_GENERATE_BTC_ADDRESS, value)),
	}),
)(ModalCreateBtcAddress);

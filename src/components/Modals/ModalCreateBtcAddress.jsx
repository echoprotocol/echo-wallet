import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal, setError } from '../../actions/ModalActions';
import { MODAL_GENERATE_BTC_ADDRESS } from '../../constants/ModalConstants';
import { generateBtcAddress } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { isBackupAddress } from '../../helpers/SidechainHelper';
import ErrorMessage from '../../components/ErrorMessage';

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
			show, error, intl,
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
									<h2 className="modal-header-title">
										{intl.formatMessage({ id: 'modals.modal_create_btc_address.title' })}
									</h2>
								</div>
								<Form className="modal-body">
									<div className="info-text">
										{intl.formatMessage({ id: 'modals.modal_create_btc_address.text' })}
									</div>

									<div className={classnames('field error-wrap', { error: !!error })}>
										<label htmlFor="address">
											{intl.formatMessage({ id: 'modals.modal_create_btc_address.backup_address_input.title' })}
										</label>
										<input
											type="text"
											placeholder={intl.formatMessage({ id: 'modals.modal_create_btc_address.backup_address_input.placeholder' })}
											name="address"
											onChange={(e) => this.onChange(e)}
											autoFocus
										/>
										<ErrorMessage
											show={!!error}
											value="modals.modal_create_btc_address.warning"
											intl={intl}
										/>
										<span className="warning-message">
											{intl.formatMessage({ id: 'modals.modal_create_btc_address.warning' })}
										</span>
									</div>
									<div className="form-panel">
										<Button
											className="main-btn countdown-wrap"
											content={
												intl.formatMessage({ id: 'modals.modal_create_btc_address.generate_button_text' })
											}
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
	intl: PropTypes.any.isRequired,
};

ModalCreateBtcAddress.defaultProps = {
	show: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_BTC_ADDRESS, 'show']),
		error: state.modal.getIn([MODAL_GENERATE_BTC_ADDRESS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_BTC_ADDRESS)),
		generateBtcAddress: (address) => dispatch(generateBtcAddress(address)),
		setError: (value) => dispatch(setError(MODAL_GENERATE_BTC_ADDRESS, value)),
	}),
)(ModalCreateBtcAddress));

import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal, setError } from '../../actions/ModalActions';
import { MODAL_GENERATE_BTC_STAKE_ADDRESS } from '../../constants/ModalConstants';
import { generateStakeBtcAddress } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';
import { isBackupAddress } from '../../helpers/SidechainHelper';
import ErrorMessage from '../../components/ErrorMessage';

class ModalCreateBtcStakeAddress extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			address: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	onChange(e) {
		this.props.setError(null);
		this.setState({ address: e.target.value });
	}
	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	generateStakeBtcAddress(submit) {
		if (!isBackupAddress(this.state.address)) {
			this.props.setError('Wrong address');
			return;
		}
		this.props.closeModal();
		submit();
	}

	render() {
		const {
			show, error, intl,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.generateStakeBtcAddress(this.state.address)}
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
										{intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.title' })}
									</h2>
								</div>
								<Form className="modal-body">
									<div className="info-text">
										{intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.text' })}
									</div>
									<div className="field-wrap">
										<div className={classnames('field', { error: !!error })}>
											<label htmlFor="address">
												{intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.backup_address_input.title' })}
											</label>
											<div className="action-wrap">
												<input
													type="text"
													placeholder={intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.backup_address_input.placeholder' })}
													name="address"
													onChange={(e) => this.onChange(e)}
													autoFocus
												/>
												<ErrorMessage
													value={error ? 'modals.modal_create_btc_stake_address.warning' : ''}
													intl={intl}
												/>
											</div>
											<span className="warning-message">
												{intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.warning' })}
											</span>
										</div>
									</div>
									<div className="form-panel">
										<Button
											className="main-btn countdown-wrap"
											content={
												intl.formatMessage({ id: 'modals.modal_create_btc_stake_address.generate_button_text' })
											}
											onClick={() => {
												this.generateStakeBtcAddress(submit);
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

ModalCreateBtcStakeAddress.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	generateStakeBtcAddress: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalCreateBtcStakeAddress.defaultProps = {
	show: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_BTC_STAKE_ADDRESS, 'show']),
		error: state.modal.getIn([MODAL_GENERATE_BTC_STAKE_ADDRESS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_BTC_STAKE_ADDRESS)),
		generateStakeBtcAddress: (address) => dispatch(generateStakeBtcAddress(address)),
		setError: (value) => dispatch(setError(MODAL_GENERATE_BTC_STAKE_ADDRESS, value)),
	}),
)(ModalCreateBtcStakeAddress));

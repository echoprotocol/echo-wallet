import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal, setError } from '../../actions/ModalActions';

import { MODAL_GENERATE_ECHO_ADDRESS } from '../../constants/ModalConstants';
import { generateEchoAddress } from '../../actions/TransactionActions';
import TransactionScenario from '../../containers/TransactionScenario';

class ModalCreateEchoAddress extends React.Component {

	constructor(props) {
		super(props);
		this.DEFAULT_STATE = {
			label: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	onGenerateEchoAdress(submit) {
		this.props.closeModal();
		submit();
	}

	onChange(e) {
		this.props.setError(null);
		this.setState({ label: e.target.value });
	}

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	render() {
		const {
			show, error, intl, keyWeightWarn,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.generateEchoAddress(this.state.label)}
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
										{intl.formatMessage({ id: 'modals.modal_create_echo_address.title' })}
									</h2>
								</div>
								<Form className="modal-body">
									<div className="info-text">
										{intl.formatMessage({ id: 'modals.modal_create_echo_address.text' })}
									</div>

									<div className={classnames('field', { error: !!error })}>
										<label htmlFor="address">
											{intl.formatMessage({ id: 'modals.modal_create_echo_address.address_input.title' })}
										</label>
										<input
											type="text"
											placeholder={
												intl.formatMessage({ id: 'modals.modal_create_echo_address.address_input.placeholder' })
											}
											name="address"
											onChange={(e) => this.onChange(e)}
											autoFocus
										/>
										{
											error ?
												<span className="error-message">
													{intl.formatMessage({ id: error })}
												</span> : null
										}
										<span className="warning-message">
											{intl.formatMessage({ id: 'modals.modal_create_echo_address.warning' })}
										</span>
									</div>
									<div className="form-panel">
										<Button
											type="submit"
											className="main-btn"
											onClick={() => this.onGenerateEchoAdress(submit)}
											content={intl.formatMessage({ id: 'modals.modal_create_echo_address.generate_button_text' })}
											disabled={keyWeightWarn}
										/>
									</div>
								</Form>
							</FocusLock>
						</Modal>
					)
				}
			</TransactionScenario>
		);
	}

}

ModalCreateEchoAddress.propTypes = {
	show: PropTypes.bool,
	error: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	generateEchoAddress: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
};

ModalCreateEchoAddress.defaultProps = {
	show: false,
	error: null,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_ECHO_ADDRESS, 'show']),
		error: state.modal.getIn([MODAL_GENERATE_ECHO_ADDRESS, 'error']),
		keyWeightWarn: state.global.get('keyWeightWarn'),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_ECHO_ADDRESS)),
		generateEchoAddress: (label) => dispatch(generateEchoAddress(label)),
		setError: (value) => dispatch(setError(MODAL_GENERATE_ECHO_ADDRESS, value)),
	}),
)(ModalCreateEchoAddress));

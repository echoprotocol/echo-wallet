import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

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
			show, error,
		} = this.props;

		return (
			<TransactionScenario
				handleTransaction={() => this.props.generateEchoAddress(this.state.label)}
			>
				{
					(submit) => (
						<Modal className="create-address-modal" open={show} dimmer="inverted">
							<span
								className="icon-close"
								onClick={(e) => this.onClose(e)}
								onKeyDown={(e) => this.onClose(e)}
								role="button"
								tabIndex="0"
							/>
							<div className="modal-header">
								<h3 className="modal-header-title">Create address name</h3>
							</div>
							<form className="modal-body">
								<div className="info-text">
									You can use several addresses referring to one account for different targets.
									Please create address name for a new one.
								</div>

								<Form.Field className={classnames('error-wrap', { error: !!error })}>
									<label htmlFor="address">Address name</label>
									<input
										type="text"
										placeholder="Address name"
										name="address"
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>
									{
										false && <span className="error-message">some error</span>
									}
									<span className="warning-message">
										Warning: Please note, address names are visible
										for blockchain network participants.
									</span>
								</Form.Field>
								<div className="form-panel">
									<Button
										type="submit"
										className="main-btn countdown-wrap"
										content="Generate address"
										onClick={() => this.onGenerateEchoAdress(submit)}
									/>
								</div>
							</form>
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
};

ModalCreateEchoAddress.defaultProps = {
	show: false,
	error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_ECHO_ADDRESS, 'show']),
		error: state.modal.getIn([MODAL_GENERATE_ECHO_ADDRESS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_ECHO_ADDRESS)),
		generateEchoAddress: (label) => dispatch(generateEchoAddress(label)),
		setError: (value) => dispatch(setError(MODAL_GENERATE_ECHO_ADDRESS, value)),
	}),
)(ModalCreateEchoAddress);

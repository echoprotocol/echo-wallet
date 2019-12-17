import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';

import { setParamValue, closeModal } from '../../actions/ModalActions';
import { addToken } from '../../actions/BalanceActions';

import { MODAL_TOKENS } from '../../constants/ModalConstants';

import { contractIdRegex } from '../../helpers/ValidateHelper';

class ModalTokens extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInput(e) {
		if (!e.target.value.match(contractIdRegex)) {
			return;
		}
		this.props.setParamValue('contractId', e.target.value);
	}

	onClick() {
		this.props.addToken(this.props.contractId.value.trim());
	}

	render() {
		const { show, contractId, disabled } = this.props;

		return (
			<Modal className="modal-wrap" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h2 className="modal-header-title">Add ERC20 token to watch list</h2>
					</div>
					<div className="modal-body">
						<form className="main-form">
							<div className="field-wrap">
								<div className={classnames('field error-wrap', { error: contractId.error })}>
									<label htmlFor="tokens">Contract ID</label>
									<input
										type="text"
										placeholder="Contract ID"
										name="contractId"
										className="ui input"
										value={contractId.value}
										onChange={(e) => this.onInput(e)}
										autoFocus
									/>
									<span className="error-message">{contractId.error}</span>
								</div>
							</div>
							<div className="form-panel">
								<Button
									type="submit"
									className="main-btn"
									onClick={(e) => this.onClick(e)}
									disabled={disabled}
									content="Watch Token"
								/>
							</div>
						</form>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalTokens.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool.isRequired,
	contractId: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	setParamValue: PropTypes.func.isRequired,
	addToken: PropTypes.func.isRequired,
};

ModalTokens.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_TOKENS, 'show']),
		disabled: state.modal.getIn([MODAL_TOKENS, 'loading']),
		contractId: state.modal.getIn([MODAL_TOKENS, 'contractId']),
		error: state.modal.getIn([MODAL_TOKENS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TOKENS)),
		setParamValue: (param, value) => dispatch(setParamValue(MODAL_TOKENS, param, value)),
		addToken: (value) => dispatch(addToken(value)),
	}),
)(ModalTokens);

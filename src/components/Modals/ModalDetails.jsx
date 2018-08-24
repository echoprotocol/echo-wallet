import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTransactionDetails } from '../../helpers/FormatHelper';
import { closeModal } from '../../actions/ModalActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

import { MODAL_DETAILS } from '../../constants/ModalConstants';


class ModalDetails extends React.Component {

	onClose() {
		this.props.closeModal();
		this.props.resetTransaction();
	}

	onConfirm() {
		this.props.sendTransaction();
	}

	getArea(key, data) {
		return (
			<Form.Field className="comment" key={key} label="Note" disabled control="textarea" value={data} />
		);
	}

	getInput(key, data) {
		return (
			<Form.Field key={key}>
				<label htmlFor="amount">
					{key}
				</label>
				<div>
					<input type="text" name="Fee" disabled className="ui input" value={data} />
				</div>
			</Form.Field>
		);
	}

	renderOptions() {
		const { operation, showOptions } = this.props;

		const formatedOptions = getTransactionDetails(operation, showOptions.toJS());

		return Object.entries(formatedOptions).map(([key, value]) => (
			value.field === 'area' ? this.getArea(key, value.data) : this.getInput(key, value.data)
		));
	}

	render() {
		const { showOptions, show, disabled } = this.props;

		return (
			<Modal className="small" open={show} dimmer="inverted">
				<div className="modal-content">
					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Confirm transaction</h3>
							</div>
							<div className="field-wrap">
								{ showOptions ? this.renderOptions() : null }
							</div>
							<div className="form-panel">
								<Button basic type="button" color="grey" onClick={() => this.onClose()}>Cancel</Button>
								<Button basic type="button" color="orange" onClick={() => this.onConfirm()} disabled={disabled}>
									Confirm
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalDetails.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool.isRequired,
	showOptions: PropTypes.any,
	operation: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
};

ModalDetails.defaultProps = {
	show: false,
	showOptions: null,
	operation: '',
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_DETAILS, 'show']),
		disabled: state.modal.getIn([MODAL_DETAILS, 'disabled']),
		showOptions: state.transaction.get('showOptions'),
		operation: state.transaction.get('operation'),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_DETAILS)),
		resetTransaction: () => dispatch(resetTransaction()),
		sendTransaction: (value) => dispatch(sendTransaction(value)),
	}),
)(ModalDetails);

import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_CONFIRM_TRANSACTIONS } from './../../constants/ModalConstants';

class ConfirmTransaction extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	render() {
		const { show } = this.props;
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
								<Form.Field className="comment" label="Data" placeholder="Data" disabled control="textarea" />
								<Form.Field>
									<label htmlFor="amount">
                                        Amount
										<ul className="list-amount">
											<li>
                                                Available Balance: <span> 0.09298 ECHO</span>
											</li>
										</ul>
									</label>
									<div>
										<input type="text" placeholder="Token name" name="amount" disabled className="ui input" value="" />
										<span className="error-message" />
									</div>
								</Form.Field>
								<Form.Field>
									<label htmlFor="amount">
                                        Fee
									</label>
									<div>
										<input type="text" placeholder="Fee" name="Fee" disabled className="ui input" value="" />
										<span className="error-message" />
									</div>
								</Form.Field>
							</div>
							<div className="form-panel">
								<Button basic type="submit" color="gray">Cancel</Button>
								<Button basic type="submit" color="orange">Confirm</Button>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ConfirmTransaction.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ConfirmTransaction.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CONFIRM_TRANSACTIONS, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_CONFIRM_TRANSACTIONS)),
	}),
)(ConfirmTransaction);

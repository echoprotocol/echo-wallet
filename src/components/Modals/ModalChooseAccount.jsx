import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';

import { MODAL_CHOOSE_ACCOUNT } from '../../constants/ModalConstants';


class ModalChooseAccount extends React.Component {

	onClose() {
		this.props.closeModal();
	}

	onConfirm() {
		this.props.closeModal();
	}

	render() {
		const { show } = this.props;

		return (
			<Modal className="choose-account" open={show} dimmer="inverted">
				<div className="modal-content">
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Choose account</h3>
							</div>
							<section className="accounts-list">
								<div className="accounts-list_header">
									<div className="check-container">
										<div className="check">
											<input type="checkbox" id={1} />
											<label className="label" htmlFor={1}>
												<span className="label-text">Accounts</span>
											</label>
										</div>
										<button className="sort-icon" />
									</div>
									<div className="check-container">
										<div className="txt">Balance</div>
										<button className="sort-icon" />
									</div>
								</div>
								<div className="accounts-list_list">
									<div className="line">
										<div className="check">
											<input type="checkbox" id={2} />
											<label className="label" htmlFor={2}>
												<span className="label-text">valentine_prusski</span>
											</label>
										</div>
										<div className="value">0.000083 ECHO</div>
									</div>
								</div>
							</section>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onConfirm()}
									content="Continue"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalChooseAccount.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ModalChooseAccount.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CHOOSE_ACCOUNT, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_CHOOSE_ACCOUNT)),
	}),
)(ModalChooseAccount);

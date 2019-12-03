import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/ModalActions';
// import { FORM_TRANSFER } from '../../constants/FormConstants';

import { MODAL_REPLENISH } from '../../constants/ModalConstants';

class ModalToWhitelist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}


	render() {
		const {
			show,
		} = this.props;

		return (
			<Modal className="replenish-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Replenish Fee Pool</h3>
				</div>
				<div className="modal-body">
					<div className="field-wrap">

						{/* <AccountField
							currency={currency}
							subject="from"
							field={from}
							checkAccount={this.props.checkAccount}
							setIn={this.props.setIn}
							setFormValue={this.props.setFormValue}
							getTransferFee={this.props.getTransferFee}
							setContractFees={this.props.setContractFees}
							setValue={this.props.setValue}
						/>

						<AmountField
							fees={fees}
							form={FORM_TRANSFER}
							fee={fee}
							assets={assets}
							tokens={subjectTransferType === CONTRACT_ID_SUBJECT_TYPE ? new List([]) : tokens}
							amount={amount}
							currency={currency}
							isAvailableBalance={isAvailableBalance}
							amountInput={this.props.amountInput}
							setFormError={this.props.setFormError}
							setFormValue={this.props.setFormValue}
							setValue={this.props.setValue}
							setDefaultAsset={this.props.setDefaultAsset}
							getTransferFee={this.props.getTransferFee}
							setContractFees={this.props.setContractFees}
							setTransferFee={this.props.setTransferFee}
						/> */}
					</div>

					<div className="form-panel">
						<Button
							className="main-btn"
							content="Send"
							onClick={(e) => this.onClose(e)}
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalToWhitelist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ModalToWhitelist.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_REPLENISH, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_REPLENISH)),
	}),
)(ModalToWhitelist);

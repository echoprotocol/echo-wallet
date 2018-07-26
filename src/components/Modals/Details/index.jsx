import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../../actions/ModalActions';
import { resetTransactionValues } from '../../../actions/TransactionBuilderActions';
import { clearForm } from '../../../actions/FormActions';

import { MODAL_DETAILS } from './../../../constants/ModalConstants';
import { FORM_TRANSACTION_DETAILS } from './../../../constants/FormConstants';

import InputRow from './InputRow';
import TextAreaRow from './TextAreaRow';

class ModalDetails extends React.Component {

	onClose() {
		this.props.closeModal();
		this.props.clearDetails();
		this.props.clearForm();
	}

	onConfirm() {

	}

	render() {
		const { show } = this.props;
		const bytecode = '608060405234801561001057600080fd5b506101a2806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630775107014610046575b600080fd5b34801561005257600080fd5b5061005b61005d565b005b60405180807f312e322e35206c69666574696d655f72656665727265725f6665655f7065726381526020017f656e746167650000000000000000000000000000000000000000000000000000815250602601905060405180910390bb600090805190602001906100ce9291906100d1565b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011257805160ff1916838001178555610140565b82800160010185558215610140579182015b8281111561013f578251825591602001919060010190610124565b5b50905061014d9190610151565b5090565b61017391905b8082111561016f576000816000905550600101610157565b5090565b905600a165627a7a72305820f15a07ca60484fc3690bf46c388f8330643974e18925d812c5a73ba93e5c9e400029'
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
								<TextAreaRow label="Byte code" data={bytecode} />
								<InputRow label="Fee" data="100" />
							</div>
							<div className="form-panel">
								<Button basic type="submit" color="gray" onClick={() => this.onClose()}>Cancel</Button>
								<Button basic type="submit" color="orange" onClick={() => this.onConfirm()}>Confirm</Button>
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
	closeModal: PropTypes.func.isRequired,
	clearDetails: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

ModalDetails.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_DETAILS, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_DETAILS)),
		clearDetails: () => dispatch(resetTransactionValues()),
		clearForm: () => dispatch(clearForm(FORM_TRANSACTION_DETAILS)),
	}),
)(ModalDetails);

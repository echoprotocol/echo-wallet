import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../../actions/ModalActions';
import { clearForm } from '../../../actions/FormActions';
import { setDetailsForm } from '../../../actions/DetailsActions';
import { makeRequest, resetTransactionValues } from '../../../actions/TransactionActions';

import { MODAL_DETAILS } from './../../../constants/ModalConstants';
import { FORM_TRANSACTION_DETAILS } from './../../../constants/FormConstants';

import InputRow from './InputRow';
import TextAreaRow from './TextAreaRow';
import Loading from '../../Loading';

class ModalDetails extends React.Component {

	shouldComponentUpdate(nextProps) {

		const { options: currentOptions } = this.props;
		const { options: nextOptions } = nextProps;

		const { formatedOptions: currentFormatOption } = this.props;
		const { formatedOptions: nextFormatOption } = nextProps;

		if (nextOptions && (currentOptions !== nextOptions)) {
			this.props.transformOptions(nextProps.options);
			return true;
		} else if (nextFormatOption && (nextFormatOption !== currentFormatOption)) {
			return true;
		} else if (nextProps.show) {
			return true;
		}
		return false;
	}

	onClose() {
		this.props.closeModal();
		this.props.clearDetails();
		this.props.clearForm();
	}

	onConfirm() {
		if (!this.props.onBuild) {
			this.onClose();
		} else {
			this.props.makeRequest(this.props.options);
		}
	}

	renderDetails() {
		const { show, formatedOptions } = this.props;
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
								{
									Object.keys(formatedOptions).map((k, i) => {
										if (k === 'loading' || k === 'error') return undefined;
										const id = i;
										const data = String(formatedOptions[k].value.data) || '';
										if (formatedOptions[k].value.field === 'area') {
											return (
												<TextAreaRow key={id} label={k} data={data} />
											);
										}
										return (
											<InputRow key={id} label={k} data={data} />
										);
									})
								}

							</div>
							<div className="form-panel">
								<Button basic type="submit" color="grey" onClick={() => this.onClose()}>Cancel</Button>
								<Button basic type="submit" color="orange" onClick={() => this.onConfirm()}>Confirm</Button>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

	render() {
		const { formatedOptions } = this.props;
		return (
			<React.Fragment>
				{
					formatedOptions ? this.renderDetails() : <Loading />
				}
			</React.Fragment>
		);
	}

}

ModalDetails.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	clearDetails: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	options: PropTypes.object.isRequired,
	onBuild: PropTypes.bool.isRequired,
	formatedOptions: PropTypes.object.isRequired,
	transformOptions: PropTypes.func.isRequired,
	makeRequest: PropTypes.func.isRequired,
};

ModalDetails.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_DETAILS, 'show']),
		formatedOptions: state.form.get(FORM_TRANSACTION_DETAILS).toJS(),
		onBuild: state.transaction.get('onBuild'),
		options: state.transaction,
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_DETAILS)),
		clearDetails: () => dispatch(resetTransactionValues()),
		clearForm: () => dispatch(clearForm(FORM_TRANSACTION_DETAILS)),
		transformOptions: (value) => dispatch(setDetailsForm(value)),
		makeRequest: (value) => dispatch(makeRequest(value)),
	}),
)(ModalDetails);

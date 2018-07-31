import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { MODAL_WATCH_LIST } from '../../constants/ModalConstants';

import { setParamValue, closeModal } from '../../actions/ModalActions';
import { addContract } from '../../actions/ContractActions';

class ModalWatchList extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInput(e) {
		this.props.setParamValue(e.target.name, e.target.value);
	}

	onClick() {
		const { address, abi } = this.props;

		this.props.addContract(address.trim(), abi.trim());
	}

	render() {
		const { show, address, abi } = this.props;
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
						<Form className="user-form">
							<div className="form-info">
								<h3>Add contract to watch list</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="Address">Address</label>
									<div className={classnames({ error: address.error })}>
										<input type="text" placeholder="Contract address" name="address" className="ui input" value={address.value} />
										<span className="error-message">{address.error}</span>
									</div>
								</Form.Field>
								<Form.Field>
									<label htmlFor="Abi">ABI</label>
									<div className={classnames({ error: abi.error })}>
										<input type="text" placeholder="Contract ABI" name="abi" className="ui input" value={abi.value} />
										<span className="error-message">{abi.error}</span>
									</div>
								</Form.Field>
							</div>
							<Button basic type="button" color="orange" onClick={(e) => this.onClick(e)}>Watch Contract</Button>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWatchList.propTypes = {
	show: PropTypes.bool,
	address: PropTypes.string,
	abi: PropTypes.string,
	closeModal: PropTypes.func.isRequired,
	setParamValue: PropTypes.func.isRequired,
	addContract: PropTypes.func.isRequired,
};

ModalWatchList.defaultProps = {
	show: false,
	address: '',
	abi: '',
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_WATCH_LIST, 'show']),
		address: state.modal.getIn([MODAL_WATCH_LIST, 'address']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_WATCH_LIST)),
		setParamValue: (param, value) => dispatch(setParamValue(MODAL_WATCH_LIST, param, value)),
		addContract: (address, abi) => dispatch(addContract(address, abi)),
	}),
)(ModalWatchList);

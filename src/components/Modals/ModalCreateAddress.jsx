import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/ModalActions';

import { MODAL_GENERATE_ADDRESS } from '../../constants/ModalConstants';
import { getBTCAdress } from '../../actions/TransactionActions';

class ModalGenerateAddress extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	onGenerateBTCAdress() {
		this.props.getBTCAdress(this.state.adress);
	}
	onChange(e) {
		this.setState({ adress: e.target.value });
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
			<Modal className="create-address-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={() => this.onGenerateBTCAdress()}
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

					<Form.Field className={classnames('error-wrap', { error: false })}>
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
							Warning: Please note, address names are visible for blockchain network participants.
						</span>
					</Form.Field>
					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn countdown-wrap"
							content="Generate address"
						/>
					</div>
				</form>
			</Modal>
		);
	}

}

ModalGenerateAddress.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	getBTCAdress: PropTypes.func.isRequired,
};

ModalGenerateAddress.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_GENERATE_ADDRESS, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_GENERATE_ADDRESS)),
		getBTCAdress: (adress) => dispatch(getBTCAdress(adress)),
	}),
)(ModalGenerateAddress);

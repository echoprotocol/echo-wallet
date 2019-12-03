import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/ModalActions';

import { MODAL_TO_WHITELIST } from '../../constants/ModalConstants';

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
			<Modal className="to-whitelist-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Add account to whitelist</h3>
				</div>
				<div className="modal-body">
					<Form.Field>
						<label htmlFor="account-name">Account name</label>
						<input
							type="text"
							placeholder="Account name"
							name="account-name"
						/>
					</Form.Field>
					<div className="form-panel">
						<Button
							className="main-btn"
							content="Confirm"
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
		show: state.modal.getIn([MODAL_TO_WHITELIST, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TO_WHITELIST)),
	}),
)(ModalToWhitelist);

import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ADD_KEY } from '../../constants/ModalConstants';

class ModalInfoWallet extends React.Component {

	onClose() {
		this.props.close();
	}
	onConfirm() { }

	render() {
		const { show } = this.props;

		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content add-key">
					<div className="modal-header">Would you like to add other keys now?</div>
					<div className="modal-body">
						<div className="info-text">
							Your account settings require more than one key to sign a transaction. <br />
							You can add more keys now or later on the Backup and Permissions page.
						</div>
						<div className="form-panel">
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={() => this.onClose()}
								content="Do it later"
							/>
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={() => this.onConfirm()}
								content="Proceed"
							/>
						</div>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalInfoWallet.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalInfoWallet.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ADD_KEY, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ADD_KEY)),
	}),
)(ModalInfoWallet);


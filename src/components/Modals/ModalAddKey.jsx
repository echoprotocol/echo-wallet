import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { closeModal } from '../../actions/ModalActions';
import { PROPOSAL_ADD_WIF } from '../../constants/ModalConstants';
import { PERMISSIONS_PATH } from '../../constants/RouterConstants';


class ModalInfoWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}
	onConfirm(e) {
		e.preventDefault();
		this.props.history.push(PERMISSIONS_PATH);
		this.props.close();
	}

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
								onClick={(e) => this.onClose(e)}
								content="Do it later"
							/>
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={(e) => this.onConfirm(e)}
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
	history: PropTypes.any.isRequired,
	close: PropTypes.func.isRequired,
};

ModalInfoWallet.defaultProps = {
	show: false,
};


export default withRouter(connect(
	(state) => ({
		show: state.modal.getIn([PROPOSAL_ADD_WIF, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(PROPOSAL_ADD_WIF)),
	}),
)(ModalInfoWallet));


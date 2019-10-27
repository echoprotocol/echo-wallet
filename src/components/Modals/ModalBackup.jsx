import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_BACKUP } from '../../constants/ModalConstants';


class ModalBackup extends React.Component {

	onClose() {
		this.props.close();
	}

	render() {
		const { show } = this.props;

		return (
			<Modal className="backup-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Backup</h3>
				</div>
				<div className="modal-body">
					<Form.Field>
						<label htmlFor="account-name">Account name</label>
						<input
							type="text"
							placeholder="Account name"
							disabled
							name="account-name"
						/>
					</Form.Field>
					<Form.Field>
						<label htmlFor="id-account">ID account</label>
						<input
							type="text"
							placeholder="ID account"
							disabled
							name="id-account"
						/>
					</Form.Field>
					<Form.Field>
						<label htmlFor="backup-data">Backup data</label>
						<textarea
							type="text"
							placeholder="Backup data"
							name="backup-data"
						/>
						<span className="warning-message">
							Warning: Anyone who has access to your private key can steal all your Echo
							assets and this key can never be recovered if you lose it.
						</span>
					</Form.Field>

					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => {}}
							content="Save As .TXT"
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalBackup.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalBackup.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_BACKUP, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_BACKUP)),
	}),
)(ModalBackup);


import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';

class ModalConfirmEditingOfPermissions extends React.Component {

	onConfirm() {
		this.props.confirm();
	}
	onClose() {
		this.props.close();
	}
	render() {
		const {
			show, warningMessage, echoRandMessage,
		} = this.props;
		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={() => this.onClose()}
					/>
					<div className="modal-content add-key">
						<div className="modal-header">
							<h2 className="modal-header-title">Please, confirm applying changes</h2>
						</div>
						<div className="modal-body">
							<div className="info-text">
								{
									warningMessage && <span>{warningMessage}</span>
								}
								{
									echoRandMessage && warningMessage && <br />
								}
								{
									echoRandMessage && <span>{echoRandMessage}</span>
								}
							</div>
							<div className="form-panel">
								<Button
									className="main-btn"
									onClick={() => this.onClose()}
									content="No"
								/>
								<Button
									className="main-btn"
									onClick={() => this.onConfirm()}
									content="Proceed"
								/>
							</div>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}


ModalConfirmEditingOfPermissions.propTypes = {
	show: PropTypes.bool,
	confirm: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	warningMessage: PropTypes.string,
	echoRandMessage: PropTypes.string,
};

ModalConfirmEditingOfPermissions.defaultProps = {
	show: false,
	warningMessage: '',
	echoRandMessage: '',
};

export default ModalConfirmEditingOfPermissions;

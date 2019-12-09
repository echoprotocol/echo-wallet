import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

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
				<FocusTrap>
					<div className="focus-trap-wrap">
						<div className="modal-content add-key">
							<div className="modal-header">Please, confirm applying changes</div>
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
										onClick={(e) => this.onClose(e)}
										content="No"
									/>
									<Button
										className="main-btn"
										onClick={(e) => this.onConfirm(e)}
										content="Proceed"
									/>
								</div>
							</div>
						</div>
					</div>
				</FocusTrap>
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

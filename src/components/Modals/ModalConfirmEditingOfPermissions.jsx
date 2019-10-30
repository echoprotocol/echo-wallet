import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content add-key">
					<div className="modal-header">Please, confirm applying changes</div>
					<div className="modal-body">
						<div className="info-text">
							{
								echoRandMessage && <span>{echoRandMessage}</span>
							}
							{
								echoRandMessage && warningMessage && <hr />
							}
							{
								warningMessage && <span>{warningMessage}</span>
							}

						</div>
						<div className="form-panel">
							<Button
								basic
								type="button"

								className="main-btn"
								onClick={(e) => this.onClose(e)}
								content="No"
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

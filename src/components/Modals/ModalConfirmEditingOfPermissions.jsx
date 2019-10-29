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
			show,
		} = this.props;
		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content add-key">
					<div className="modal-header">Please, confirm applying changes</div>
					<div className="modal-body">
						<div className="info-text">
						If these changes are applied, you won&apos;t have
						enough keys to sign transactions. Do you want to proceed?.
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


ModalConfirmEditingOfPermissions.propTypes = {
	show: PropTypes.bool,
	confirm: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
};

ModalConfirmEditingOfPermissions.defaultProps = {
	show: false,
};

export default ModalConfirmEditingOfPermissions;

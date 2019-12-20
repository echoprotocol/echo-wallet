import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

class ModalConfirmEditingOfPermissions extends React.Component {

	onConfirm() {
		this.props.confirm();
	}
	onClose() {
		this.props.close();
	}
	render() {
		const {
			show, warningMessage, echoRandMessage, intl,
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
							<h2 className="modal-header-title">
								{intl.formatMessage({ id: 'modals.modal_confirm_editin_of_permissions.title' })}
							</h2>
						</div>
						<div className="modal-body">
							<div className="info-text">
								{
									warningMessage &&
									<span>
										{
											intl.formatMessage({ id: warningMessage })
										}
									</span>
								}
								{
									echoRandMessage && warningMessage && <br />
								}
								{
									echoRandMessage &&
									<span>
										{
											intl.formatMessage({ id: echoRandMessage })
										}
									</span>
								}
							</div>
							<div className="form-panel">
								<Button
									className="main-btn"
									onClick={() => this.onClose()}
									content={
										intl.formatMessage({ id: 'modals.modal_confirm_editin_of_permissions.close_button_text' })
									}
								/>
								<Button
									className="main-btn"
									onClick={() => this.onConfirm()}
									content={
										intl.formatMessage({ id: 'modals.modal_confirm_editin_of_permissions.confirm_button_text' })
									}
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
	intl: PropTypes.any.isRequired,
};

ModalConfirmEditingOfPermissions.defaultProps = {
	show: false,
	warningMessage: '',
	echoRandMessage: '',
};

export default injectIntl(ModalConfirmEditingOfPermissions);

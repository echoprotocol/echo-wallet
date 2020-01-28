import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import ActionBtn from '../ActionBtn';

class ModalBackup extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave(activeKeysString) {
		this.props.saveAsTxt(activeKeysString);
	}

	getActiveKeysString() {
		const { keys, activeUser, intl } = this.props;

		const accountLabel = intl.formatMessage({ id: 'modals.modal_backup.text_field.account' });
		const pubKeyLabel = intl.formatMessage({ id: 'modals.modal_backup.text_field.public_key' });
		const WIFLabel = intl.formatMessage({ id: 'modals.modal_backup.text_field.wif' });
		const keysData = [];
		keysData.push(`${accountLabel}${activeUser.get('name')}\n`);

		keys.forEach((keyItem, keyIndex) => {

			keysData.push(`${pubKeyLabel}${keyIndex + 1}\n${keyItem.publicKey}`);
			if (keyItem.wif) {
				keysData.push(`\n\n${WIFLabel}${keyIndex + 1}\n${keyItem.wif}`);
			}

			if (keyIndex !== (keys.length - 1)) {
				keysData.push('---------------------------------------');
			}

		});

		const keysDataString = keysData.join('\n');

		return keysDataString;
	}

	render() {
		const { activeUser, show, intl } = this.props;

		const activeKeysString = this.getActiveKeysString();
		const accLabel = intl.formatMessage({ id: 'modals.modal_backup.account_field.title' });
		const accPlaceholder = intl.formatMessage({ id: 'modals.modal_backup.account_field.placeholder' });
		const IDLabel = intl.formatMessage({ id: 'modals.modal_backup.id_field.title' });
		const IDPlaceholder = intl.formatMessage({ id: 'modals.modal_backup.id_field.placeholder' });
		const backupLabel = intl.formatMessage({ id: 'modals.modal_backup.backup_data_field.placeholder' });
		const backupPlaceholder = intl.formatMessage({ id: 'modals.modal_backup.backup_data_field.placeholder' });
		const backupWarning = intl.formatMessage({ id: 'modals.modal_backup.backup_data_field.warning' });
		const copyBtnTxt = intl.formatMessage({ id: 'modals.modal_backup.copy_button_text' });
		const saveBtnTxt = intl.formatMessage({ id: 'modals.modal_backup.save_button_text' });
		const title = intl.formatMessage({ id: 'modals.modal_backup.title' });
		return (
			<Modal className="backup-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">
							{title}
						</h3>
					</div>
					<div className="modal-body">
						<Form.Field>
							<label htmlFor="account-name">
								{accLabel}
							</label>
							<input
								type="text"
								placeholder={accPlaceholder}
								disabled
								name="account-name"
								value={activeUser.get('name')}
							/>
						</Form.Field>
						<Form.Field>
							<label htmlFor="id-account">
								{IDLabel}
							</label>
							<input
								type="text"
								placeholder={IDPlaceholder}
								disabled
								name="id-account"
								value={activeUser.get('id')}
							/>
						</Form.Field>
						<Form.Field>
							<label htmlFor="backup-data">
								{backupLabel}
							</label>
							<textarea
								type="text"
								placeholder={backupPlaceholder}
								name="backup-data"
								value={activeKeysString}
								readOnly
							/>
							<span className="warning-message">
								{backupWarning}
							</span>
						</Form.Field>

						<div className="form-panel">
							<ActionBtn
								icon="icon-copy"
								copy={activeKeysString}
								text={copyBtnTxt}
								labelText={intl.formatMessage({ id: 'copied_text' })}
							/>

							<Button
								type="submit"
								className="main-btn"
								onClick={() => this.onSave(activeKeysString)}
								content={saveBtnTxt}
							/>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalBackup.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	activeUser: PropTypes.any,
	saveAsTxt: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	keys: PropTypes.array,
};

ModalBackup.defaultProps = {
	activeUser: null,
	show: false,
	keys: [],
};


export default injectIntl(ModalBackup);

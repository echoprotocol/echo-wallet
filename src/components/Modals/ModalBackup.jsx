import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

import ActionBtn from '../ActionBtn';

class ModalBackup extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave(activeKeysString) {
		this.props.saveAsTxt(activeKeysString);
	}

	getActiveKeysString() {
		const { keys, activeUser } = this.props;

		const keysData = [];
		keysData.push(`Account: ${activeUser.get('name')}\n`);

		keys.forEach((keyItem, keyIndex) => {

			keysData.push(`Public Key ${keyIndex + 1}\n${keyItem.publicKey}`);
			if (keyItem.wif) {
				keysData.push(`\n\nWIF ${keyIndex + 1}\n${keyItem.wif}`);
			}

			if (keyIndex !== (keys.length - 1)) {
				keysData.push('---------------------------------------');
			}

		});

		const keysDataString = keysData.join('\n');

		return keysDataString;
	}

	render() {
		const { activeUser, show } = this.props;

		const activeKeysString = this.getActiveKeysString();
		return (
			<Modal className="backup-modal" open={show} dimmer="inverted">
				<div>
					<FocusTrap active>
						<React.Fragment>
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
										value={activeUser.get('name')}
									/>
								</Form.Field>
								<Form.Field>
									<label htmlFor="id-account">ID account</label>
									<input
										type="text"
										placeholder="ID account"
										disabled
										name="id-account"
										value={activeUser.get('id')}
									/>
								</Form.Field>
								<Form.Field>
									<label htmlFor="backup-data">Backup data</label>
									<textarea
										type="text"
										placeholder="Backup data"
										name="backup-data"
										value={activeKeysString}
										readOnly
									/>
									<span className="warning-message">
							Warning: Anyone who has access to your WIF can steal all your Echo
							assets and this key can never be recovered if you lose it.
									</span>
								</Form.Field>

								<div className="form-panel">
									<ActionBtn
										icon="icon-copy"
										copy={activeKeysString}
										text="Copy Backup Data"
									/>

									<Button
										type="submit"
										className="main-btn"
										onClick={() => this.onSave(activeKeysString)}
										content="Save As .TXT"
									/>
								</div>
							</div>
						</React.Fragment>
					</FocusTrap>
				</div>
			</Modal>
		);
	}

}

ModalBackup.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	activeUser: PropTypes.any,
	saveAsTxt: PropTypes.func.isRequired,
	keys: PropTypes.array,
};

ModalBackup.defaultProps = {
	activeUser: null,
	show: false,
	keys: [],
};


export default ModalBackup;

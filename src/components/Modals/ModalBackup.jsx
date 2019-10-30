import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalBackup extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave(activeKeysString) {
		this.props.saveAsTxt(activeKeysString);
	}

	getActiveKeysString() {
		const { keys } = this.props;

		const keysData = [];

		keys.forEach((keyItem, keyIndex) => {
			keysData.push(`Public Key ${keyIndex + 1}\n${keyItem.publicKey}\n\n`);
			keysData.push(`WIF ${keyIndex + 1}\n${keyItem.wif}\n---------------------------------------`);
		});

		const keysDataString = keysData.join('\n');

		return keysDataString;
	}

	render() {
		const { activeUser, show } = this.props;

		const activeKeysString = this.getActiveKeysString();

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
							value={activeUser.get('id')}
						/>
					</Form.Field>
					<Form.Field>
						<label htmlFor="id-account">ID account</label>
						<input
							type="text"
							placeholder="ID account"
							disabled
							name="id-account"
							value={activeUser.get('name')}
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
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => this.onSave(activeKeysString)}
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

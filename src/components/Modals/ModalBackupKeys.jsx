import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalBackupKeys extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave(activeKeysString) {
		this.props.saveAsTxt(activeKeysString);
	}

	getArea(key, data) {
		return (
			<Form.Field className="comment" key={key} label={key} disabled control="textarea" value={data} />
		);
	}

	getInput(key, data) {
		if (Array.isArray(data) && !data.length) {
			return null;
		}

		return (
			<Form.Field key={key} >
				<label htmlFor="amount">
					{key.replace(/([A-Z])/g, ' $1')}
				</label>
				<div>
					<input type="text" name="Fee" disabled className="ui input" value={data} />
				</div>
			</Form.Field>
		);
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

	renderAccountInfo() {
		const { activeUser } = this.props;

		const accountInfoinputs = [
			this.getInput('account name', activeUser.get('id')),
			this.getInput('id account', activeUser.get('name')),
		];

		return accountInfoinputs;
	}

	render() {
		const { activeUser, show, disabled } = this.props;

		let infoToRender = null;
		let activeKeysString = '';

		if (activeUser) {
			const userInfoToRender = this.renderAccountInfo();

			activeKeysString = this.getActiveKeysString();
			const activeKeysToRender = activeKeysString.length > 0 ? this.getArea('activeKeys', activeKeysString) : null;

			infoToRender = [...userInfoToRender, activeKeysToRender];
		}

		return (
			<Modal className="small confirm-transaction" open={show} dimmer="inverted">
				<div className="modal-content">
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Backup</h3>
							</div>
							<div className="field-wrap">
								{infoToRender}
							</div>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onSave(activeKeysString)}
									disabled={disabled && activeKeysString === 0}
									content="Save as.txt"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalBackupKeys.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	activeUser: PropTypes.any,
	close: PropTypes.func.isRequired,
	saveAsTxt: PropTypes.func.isRequired,
	keys: PropTypes.array,
};

ModalBackupKeys.defaultProps = {
	show: false,
	disabled: false,
	activeUser: null,
	keys: [],
};

export default ModalBackupKeys;

import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalBackupKeys extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave() {
		const { keys } = this.props;
		const keysString = `Public key:\n${keys.publicKey}\n\nWIF:${keys.wif}`;
		this.props.saveAsTxt(keysString);
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

	renderKeys() {
		const { keys } = this.props;

		return [
			this.getInput('public key', keys.publicKey),
			this.getInput('wif', keys.wif),
		];
	}

	render() {
		const { show, disabled } = this.props;

		return (
			<Modal className="small confirm-transaction" open={show} dimmer="inverted">
				<div className="modal-content">
					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>View WIF</h3>
							</div>
							<div className="field-wrap">
								{this.renderKeys()}
							</div>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onSave()}
									disabled={disabled}
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
	close: PropTypes.func.isRequired,
	saveAsTxt: PropTypes.func.isRequired,
	keys: PropTypes.object,
};

ModalBackupKeys.defaultProps = {
	show: false,
	disabled: false,
	keys: {},
};

export default ModalBackupKeys;

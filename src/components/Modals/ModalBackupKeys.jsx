import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalBackupKeys extends React.Component {

	onClose() {
		this.props.close();
	}

	onConfirm() {
		this.props.send();
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

	getPermissions(key, data) {
		return (
			<Form.Field className="field-block" key={key}>
				<p className="field-block_title">{key.replace(/([A-Z])/g, ' $1')}</p>
				<div className="field-block_edit">
					{
						data.map(([keyPermission, weight]) => (
							<React.Fragment key={Math.random()}>
								<div>
									<span>{keyPermission}</span><span>, {weight}</span>
								</div>
							</React.Fragment>
						))
					}
				</div>

			</Form.Field>
		);
	}

	renderUserInfo() {
		const { activeUser } = this.props;

		const inputs = [
			this.getInput('account name', activeUser.get('id')),
			this.getInput('id account', activeUser.get('name')),
		];

		return inputs;
	}

	render() {
		const { activeUser, show, disabled } = this.props;

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
								{ activeUser ? this.renderUserInfo() : null }
							</div>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onConfirm()}
									disabled={disabled}
									content="Confirm"
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
	send: PropTypes.func.isRequired,
};

ModalBackupKeys.defaultProps = {
	show: false,
	disabled: false,
	activeUser: null,
};

export default ModalBackupKeys;

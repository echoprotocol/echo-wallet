import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalViewWIF extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave() {
		const { keys } = this.props;
		const keysString = `Public key:\n${keys.publicKey}\n\nWIF:${keys.wif}`;
		this.props.saveAsTxt(keysString);
	}

	render() {
		const { show, keys } = this.props;

		return (
			<Modal className="view-wif-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">View WIF</h3>
				</div>
				<div className="modal-body">

					<Form.Field>
						<label htmlFor="public-key">Public Key</label>
						<input
							type="text"
							placeholder="Public Key"
							disabled
							name="public-key"
							value={keys.publicKey}
						/>
					</Form.Field>

					<Form.Field>
						<label htmlFor="public-key">WIF *</label>
						<input
							type="text"
							placeholder="WIF"
							disabled
							name="wif"
							value={keys.wif}
						/>
						<span className="warning-message">
							* Warning: Anyone who has this key can steal all your Echo
							assets and this key can never be recovered if you lose it.
						</span>
					</Form.Field>

					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => this.onSave()}
							content="Save As .TXT"
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalViewWIF.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	saveAsTxt: PropTypes.func.isRequired,
	keys: PropTypes.object,
};

ModalViewWIF.defaultProps = {
	show: false,
	keys: {},
};

export default ModalViewWIF;

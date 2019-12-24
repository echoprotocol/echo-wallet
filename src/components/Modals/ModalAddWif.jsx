import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import PasswordInput from '../PasswordInput';


class ModalAddWIF extends React.Component {


	constructor(props) {
		super(props);

		this.state = {
			wif: '',
		};
	}

	onChange(e) {
		this.setState({
			wif: e.target.value.trim(),
		});
	}

	onClose() {
		this.props.close();
	}

	saveWif() {
		const { wif } = this.state;

		this.props.saveWif(wif);
	}

	render() {
		const { wif } = this.state;
		const {
			show, error, disabled, publicKey, intl,
		} = this.props;
		const wifTitle = intl.formatMessage({ id: 'modals.modal_add_wif.wif_input.title' });
		const wifPlaceholder = intl.formatMessage({ id: 'modals.modal_add_wif.wif_input.placeholder' });
		const wifWarning = intl.formatMessage({ id: 'modals.modal_add_wif.wif_input.warnig' });
		const pubKeyPlaceholder = intl.formatMessage({ id: 'modals.modal_add_wif.public_key_input.placeholder' });

		return (
			<Modal className="add-wif-modal" open={show}>
				<button
					className="icon-close"
					onClick={(e) => this.onClose(e)}
				/>
				<div className="modal-header">
					<h2 className="modal-header-title">
						{intl.formatMessage({ id: 'modals.modal_add_wif.title' })}
					</h2>
				</div>
				<div className="modal-body">

					<Form.Field className={classnames('error-wrap', { error: !!error })}>
						<label htmlFor="public-key">
							{intl.formatMessage({ id: 'modals.modal_add_wif.public_key_input.title' })}
						</label>
						<input
							type="text"
							placeholder={pubKeyPlaceholder}
							disabled
							name="public-key"
							onChange={() => {}}
							value={publicKey}
						/>
						{
							error &&
							<span className="error-message">
								{intl.formatMessage({ id: error })}
							</span>
						}
					</Form.Field>

					<PasswordInput
						inputLabel={wifTitle}
						inputPlaceholder={wifPlaceholder}
						inputName="WIF"
						warningMessage={wifWarning}
						errorMessage={error ? intl.formatMessage({ id: error }) : null}
						onChange={(e) => this.onChange(e)}
						value={wif}
						autoFocus
					/>

					<div className="form-panel">
						<Button
							type="submit"
							className="main-btn"
							onClick={() => this.saveWif()}
							disabled={disabled}
							content={intl.formatMessage({ id: 'modals.modal_add_wif.button_text' })}
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalAddWIF.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalAddWIF.defaultProps = {
	show: false,
};

ModalAddWIF.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	close: PropTypes.func.isRequired,
	error: PropTypes.string,
	saveWif: PropTypes.func.isRequired,
	publicKey: PropTypes.string.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalAddWIF.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default injectIntl(ModalAddWIF);

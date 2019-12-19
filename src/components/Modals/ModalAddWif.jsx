import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import PasswordInput from '../PasswordInput';
import ErrorMessage from '../ErrorMessage';


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
			show, error, disabled, publicKey,
		} = this.props;

		return (
			<Modal className="add-wif-modal" open={show}>
				<button
					className="icon-close"
					onClick={(e) => this.onClose(e)}
				/>
				<div className="modal-header">
					<h2 className="modal-header-title">Add WIF</h2>
				</div>
				<div className="modal-body">

					<Form.Field className={classnames('error-wrap', { error: !!error })}>
						<label htmlFor="public-key">Public Key</label>
						<input
							type="text"
							placeholder="Public Key"
							disabled
							name="public-key"
							onChange={() => {}}
							value={publicKey}
						/>
						<ErrorMessage
							show={!!error}
							value={error && error.message}
						/>
					</Form.Field>

					<PasswordInput
						inputLabel="WIF (optional)"
						inputPlaceholder="WIF"
						inputName="WIF"
						warningMessage="Warning: Anyone who has this key can steal all your Echo assets and this key can never be recovered if you lose it."
						errorMessage={error}
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
							content="Confirm"
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
};

ModalAddWIF.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default ModalAddWIF;

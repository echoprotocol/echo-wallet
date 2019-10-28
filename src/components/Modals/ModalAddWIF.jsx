import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import InputEye from '../InputEye';


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
		const { show, error, disabled } = this.props;

		return (
			<Modal className="add-wif-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Add WIF</h3>
				</div>
				<div className="modal-body">

					<Form.Field className={classnames('error-wrap', { error: false })}>
						<label htmlFor="public-key">Public Key</label>
						<input
							type="text"
							placeholder="Public Key"
							disabled
							name="public-key"
							onChange={() => {}}
							autoFocus
						/>
						{
							false && <span className="error-message">Some Error</span>
						}
					</Form.Field>

					<InputEye
						inputLabel="WIF (optional)"
						inputPlaceholder="WIF"
						inputName="WIF"
						warningMessage="Warning: Anyone who has this key can steal all your Echo assets and this key can never be recovered if you lose it."
						errorMessage={error}
						onChange={(e) => this.onChange(e)}
					/>

					<div className="form-panel">
						<Button
							basic
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
};

ModalAddWIF.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default ModalAddWIF;

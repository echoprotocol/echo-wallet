import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ModalUnlockWallet extends React.Component {

	onSuccess() {
		this.props.unlock();
	}

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	onChange(e) {
		this.props.change(e.target.value.trim());
	}

	render() {
		const {
			show, password, error, disabled, weight, threshold,
		} = this.props;

		return (
			<Modal className="small" open={show} dimmer="inverted">
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
								<h3>{`Unlock Wallet ${(weight !== null) ? `(Threshold ${weight}/${threshold})` : ''}`}</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: !!error })}>
									<label htmlFor="Password">Password</label>
									<input
										type="password"
										placeholder="Password"
										name="password"
										className="ui input"
										value={password}
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>
									<span className="error-message">{error}</span>
								</Form.Field>
							</div>
							<Button
								basic
								type="submit"
								className="main-btn"
								onClick={(e) => this.onSuccess(e)}
								disabled={disabled}
								content="Unlock Wallet"
							/>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalUnlockWallet.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	password: PropTypes.string,
	error: PropTypes.string,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	weight: PropTypes.number,
	threshold: PropTypes.number,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	password: '',
	error: null,
	weight: null,
	threshold: null,
};

export default ModalUnlockWallet;

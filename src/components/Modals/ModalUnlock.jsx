import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import FocusLock from 'react-focus-lock';
import _ from 'lodash';

import PasswordInput from '../PasswordInput';

class ModalUnlockWallet extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.show !== this.props.show) {
			this.clear();
		}
	}

	onForgot(e) {
		e.preventDefault();

		this.props.forgot();
	}

	onSuccess() {
		this.props.unlock();
	}

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	onChange(e) {
		this.setState({ password: e.target.value.trim() });
		this.props.change(e.target.value.trim());
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	render() {
		const {
			show, error, disabled, intl,
		} = this.props;
		const { password } = this.state;
		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content">
						<button
							className="icon-close"
							onClick={(e) => this.onClose(e)}
						/>
						<div className="modal-header" />
						<div className="modal-body">
							<Form className="main-form">
								<div className="form-info">
									<h3>
										{intl.formatMessage({ id: 'modals.modal_unlock.title' })}
									</h3>
								</div>
								<div className="field-wrap">
									<PasswordInput
										errorMessage={error ? intl.formatMessage({ id: error }) : ''}
										inputLabel={intl.formatMessage({ id: 'modals.modal_unlock.password_input.title' })}
										inputPlaceholder={intl.formatMessage({ id: 'modals.modal_unlock.password_input.placeholder' })}
										inputName="password"
										value={password}
										onChange={(e) => this.onChange(e)}
										autoFocus
									/>

								</div>
								<div className="form-panel">
									<a
										className="action-link"
										role="button"
										onClick={(e) => this.onForgot(e)}
										onKeyPress={(e) => this.onForgot(e)}
										tabIndex="0"
									>
										{intl.formatMessage({ id: 'modals.modal_unlock.forgot_password_link' })}
									</a>
									<Button
										type="submit"
										className="main-btn"
										onClick={(e) => this.onSuccess(e)}
										disabled={disabled}
										content={intl.formatMessage({ id: 'modals.modal_unlock.confirm_button_text' })}
									/>
								</div>
							</Form>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalUnlockWallet.propTypes = {
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	change: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	forgot: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalUnlockWallet.defaultProps = {
	show: false,
	disabled: false,
	error: null,
};

export default injectIntl(ModalUnlockWallet);

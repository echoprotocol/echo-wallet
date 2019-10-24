import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_EDIT_PERMISSIONS } from '../../constants/ModalConstants';
import Timer from '../Timer';

class ModalEditPermissions extends React.Component {

	onClose() {
		this.props.close();
	}
	onConfirm() { }

	render() {
		const { show } = this.props;

		return (
			<Modal className="edit-permissions-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<Timer />
					<h3 className="modal-header-title">Edit Mode Warning</h3>
				</div>
				<div className="modal-body">
					<div className="info-text">
						Please, keep in mind that uncontrolled changes may lead to
						loosing access to the wallet or restricting your actions within it.
						Be careful with editing permissions and adding the accounts to manage the wallet,
						ensuring that you grant permissions only to the accounts you trust.
					</div>
					<div className="check-list">
						<div className="check">
							<input type="checkbox" id="edit-mode-checkbox" />
							<label className="label" htmlFor="edit-mode-checkbox">
								<span className="label-text">I have read and understood the possible consequences of editing</span>
							</label>
						</div>
					</div>
					<Form.Field className={classnames('error-wrap', { error: true })}>
						<label htmlFor="Password">Password</label>
						<input
							type="password"
							placeholder="Password"
							name="password"
							className="ui input"
							onChange={() => {}}
							autoFocus
						/>
						{
							false && <span className="error-message">Some Error</span>
						}
					</Form.Field>
					<div className="form-panel">
						<a
							className="action-link"
							role="button"
							onClick={() => {}}
							onKeyPress={() => {}}
							tabIndex="0"
						>
							Forgot password?
						</a>
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => {}}
							disabled={false}
							content="Go to edit mode"
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalEditPermissions.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalEditPermissions.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_EDIT_PERMISSIONS, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_EDIT_PERMISSIONS)),
	}),
)(ModalEditPermissions);


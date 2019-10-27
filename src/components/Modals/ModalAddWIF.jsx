import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_ADD_WIF } from '../../constants/ModalConstants';
import InputEye from '../InputEye';


class ModalAddWIF extends React.Component {

	onClose() {
		this.props.close();
	}

	render() {
		const { show } = this.props;

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
					/>

					<div className="form-panel">
						<Button
							basic
							type="submit"
							className="main-btn"
							onClick={() => {}}
							disabled={false}
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


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_ADD_WIF, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_ADD_WIF)),
	}),
)(ModalAddWIF);


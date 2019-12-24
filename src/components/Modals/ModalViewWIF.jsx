import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_VIEW_WIF } from '../../constants/ModalConstants';
import { ADDRESS_PREFIX } from '../../constants/GlobalConstants';
import ActionBtn from '../../components/ActionBtn';

class ModalViewWIF extends React.Component {

	onClose() {
		this.props.close();
	}

	onSave() {
		const { keys, activeUserName } = this.props;
		const keysString = `Account: ${activeUserName}\n\nPublic key:\n${keys.publicKey}\nWIF:\n${keys.wif}`;
		this.props.saveAsTxt(keysString, activeUserName, keys.publicKey.replace(ADDRESS_PREFIX, '').substring(0, 8));
	}

	render() {
		const { show, keys, intl } = this.props;

		return (
			<Modal className="view-wif-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_view_wif.title' })}
						</h3>
					</div>
					<div className="modal-body">

						<Form.Field>
							<label htmlFor="public-key">
								{intl.formatMessage({ id: 'modals.modal_view_wif.public_key_input.title' })}
							</label>
							<div className="ui action input">
								<input
									type="text"
									placeholder={intl.formatMessage({ id: 'modals.modal_view_wif.public_key_input.placeholder' })}
									disabled
									name="public-key"
									value={keys.publicKey}
								/>
								<ActionBtn
									icon="icon-copy"
									copy={keys.publicKey}
									labelText={intl.formatMessage({ id: 'copied_text' })}
									key={keys.publicKey}
								/>
							</div>
						</Form.Field>

						<Form.Field>
							<label htmlFor="public-key">
								{intl.formatMessage({ id: 'modals.modal_view_wif.wif_input.title' })}
							</label>
							<div className="ui action input">
								<input
									type="text"
									placeholder={intl.formatMessage({ id: 'modals.modal_view_wif.wif_input.placeholder' })}
									disabled
									name="wif"
									value={keys.wif}
								/>
								<ActionBtn
									icon="icon-copy"
									copy={keys.wif}
									labelText={intl.formatMessage({ id: 'copied_text' })}
								/>
							</div>
							<span className="warning-message">
								{intl.formatMessage({ id: 'modals.modal_view_wif.wif_input.warning' })}
							</span>
						</Form.Field>

						<div className="form-panel">
							<Button
								type="submit"
								className="main-btn"
								onClick={() => this.onSave()}
								content={intl.formatMessage({ id: 'modals.modal_view_wif.save_button_text' })}
							/>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalViewWIF.propTypes = {
	show: PropTypes.bool,
	activeUserName: PropTypes.string,
	close: PropTypes.func.isRequired,
	saveAsTxt: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	keys: PropTypes.object,
};

ModalViewWIF.defaultProps = {
	show: false,
	activeUserName: '',
	keys: {},
};


export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_VIEW_WIF, 'show']),
		activeUserName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_VIEW_WIF)),
	}),
)(ModalViewWIF));

import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';

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
		const { show, keys } = this.props;

		return (
			<Modal className="view-wif-modal" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>
					<div className="modal-header">
						<h3 className="modal-header-title">View WIF</h3>
					</div>
					<div className="modal-body">

						<Form.Field>
							<label htmlFor="public-key">Public Key</label>
							<div className="ui action input">
								<input
									type="text"
									placeholder="Public Key"
									disabled
									name="public-key"
									value={keys.publicKey}
								/>
								<ActionBtn
									icon="icon-copy"
									copy={keys.publicKey}
								/>
							</div>
						</Form.Field>

						<Form.Field>
							<label htmlFor="public-key">WIF *</label>
							<div className="ui action input">
								<input
									type="text"
									placeholder="WIF"
									disabled
									name="wif"
									value={keys.wif}
								/>
								<ActionBtn
									icon="icon-copy"
									copy={keys.wif}
								/>
							</div>
							<span className="warning-message">
									* Warning: Anyone who has this key can steal all your Echo
									assets and this key can never be recovered if you lose it.
							</span>
						</Form.Field>

						<div className="form-panel">
							<Button
								type="submit"
								className="main-btn"
								onClick={() => this.onSave()}
								content="Save As .TXT"
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
	keys: PropTypes.object,
};

ModalViewWIF.defaultProps = {
	show: false,
	activeUserName: '',
	keys: {},
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_VIEW_WIF, 'show']),
		activeUserName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_VIEW_WIF)),
	}),
)(ModalViewWIF);

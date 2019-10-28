import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalViewWIF from '../../components/Modals/ModalViewWIF';
import ModalAddWIF from '../../components/Modals/ModalAddWif';

import { MODAL_UNLOCK_VIEW_WIF, MODAL_WIPE, MODAL_VIEW_WIF, MODAL_UNLOCK_ADD_WIF, MODAL_ADD_WIF } from '../../constants/ModalConstants';
import { toastError } from '../../helpers/ToastHelper';
import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock, asyncUnlock, saveWifToDb } from '../../actions/AuthActions';

import Services from '../../services';

class PrivateKeyScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			publicKey: '',
			wif: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	async setWIFKey() {
		const { password, publicKey } = this.state;

		const userStorage = Services.getUserStorage();
		const key = await userStorage.getWIFByPublicKey(publicKey, { password });

		if (!key) {
			toastError('Private key was not imported in Echo Desktop Wallet');
			return;
		}

		this.setState(() => ({
			publicKey,
			// eslint-disable-next-line react/no-unused-state
			wif: key.wif,
		}));
	}

	saveAsTxt(keysString) {
		const donwloadElement = document.createElement('a');
		const txtFile = new Blob([keysString], { type: 'text/plain' });
		donwloadElement.href = URL.createObjectURL(txtFile);
		donwloadElement.download = 'echo-backup.txt';
		donwloadElement.click();
	}

	saveWif(wif) {
		const { password, publicKey } = this.state;
		const { account } = this.props;

		this.props.saveWifToDb(publicKey, wif, account.toJS(), password);
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	showWif(publicKey) {
		this.setState({ password: '', publicKey });
		this.props.openModal(MODAL_UNLOCK_VIEW_WIF);
	}

	addWif(publicKey) {
		this.setState({ password: '', publicKey });
		this.props.openModal(MODAL_UNLOCK_ADD_WIF);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK_VIEW_WIF].get('error')) {
			this.props.clear(MODAL_UNLOCK_VIEW_WIF);
		}
	}

	unlockToShow() {
		const { password } = this.state;

		this.props.asyncUnlock(password, async () => {
			await this.setWIFKey();
			this.props.openModal(MODAL_VIEW_WIF);
		}, MODAL_UNLOCK_VIEW_WIF);
	}

	unlockToAdd() {
		const { password } = this.state;

		this.props.unlock(password, async () => {
			this.props.openModal(MODAL_ADD_WIF);
		}, MODAL_UNLOCK_ADD_WIF);
	}

	close(modal) {
		this.setState({ password: '', publicKey: '' });
		this.props.closeModal(modal);
	}

	forgot() {
		this.setState({ password: '' });
		this.props.closeModal(MODAL_UNLOCK_VIEW_WIF);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK_VIEW_WIF]: ModalViewWIFUnlockUnlock,
			[MODAL_UNLOCK_ADD_WIF]: modalAddWifUnlock,
			[MODAL_VIEW_WIF]: ModalViewWif,
			[MODAL_ADD_WIF]: modalAddWif,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.showWif.bind(this), this.addWif.bind(this))}
				<ModalUnlock
					show={ModalViewWIFUnlockUnlock.get('show')}
					disabled={ModalViewWIFUnlockUnlock.get('loading')}
					error={ModalViewWIFUnlockUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlockToShow()}
					close={() => this.close(MODAL_UNLOCK_VIEW_WIF)}
					forgot={() => this.forgot()}
				/>
				<ModalUnlock
					show={modalAddWifUnlock.get('show')}
					disabled={modalAddWifUnlock.get('loading')}
					error={modalAddWifUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlockToAdd()}
					close={() => this.close(MODAL_UNLOCK_ADD_WIF)}
					forgot={() => this.forgot()}
				/>
				<ModalViewWIF
					show={ModalViewWif.get('show')}
					disabled={ModalViewWif.get('loading')}
					error={ModalViewWif.get('error')}
					saveAsTxt={(backupInfo) => this.saveAsTxt(backupInfo)}
					close={() => this.close(MODAL_VIEW_WIF)}
					keys={this.state}
				/>
				<ModalAddWIF
					show={modalAddWif.get('show')}
					disabled={modalAddWif.get('loading')}
					error={modalAddWif.get('error')}
					saveWif={(wif) => this.saveWif(wif)}
					close={() => this.close(MODAL_ADD_WIF)}
					publicKey={this.state.publicKey}
				/>
			</React.Fragment>
		);
	}

}

PrivateKeyScenario.propTypes = {
	children: PropTypes.func.isRequired,

	[MODAL_UNLOCK_VIEW_WIF]: PropTypes.object.isRequired,
	[MODAL_UNLOCK_ADD_WIF]: PropTypes.object.isRequired,
	[MODAL_VIEW_WIF]: PropTypes.object.isRequired,
	[MODAL_ADD_WIF]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	asyncUnlock: PropTypes.func.isRequired,
	saveWifToDb: PropTypes.func.isRequired,
	account: PropTypes.object.isRequired,
};

export default connect(
	(state) => ({
		[MODAL_UNLOCK_VIEW_WIF]: state.modal.get(MODAL_UNLOCK_VIEW_WIF),
		[MODAL_UNLOCK_ADD_WIF]: state.modal.get(MODAL_UNLOCK_ADD_WIF),
		[MODAL_VIEW_WIF]: state.modal.get(MODAL_VIEW_WIF),
		[MODAL_ADD_WIF]: state.modal.get(MODAL_ADD_WIF),
	}),
	(dispatch) => ({
		openModal: (modal, params) => dispatch(openModal(modal, params)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		clear: (modal) => dispatch(setError(modal, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback, MODAL_UNLOCK_ADD_WIF)),
		asyncUnlock: (password, callback) =>
			dispatch(asyncUnlock(password, callback, MODAL_UNLOCK_VIEW_WIF)),
		saveWifToDb: (publicKey, wif, account, password, callback) =>
			dispatch(saveWifToDb(publicKey, wif, account, password, callback)),
	}),
)(PrivateKeyScenario);

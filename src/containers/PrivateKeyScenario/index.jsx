import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalShowWif from '../../components/Modals/ModalShowWif';

import { MODAL_UNLOCK_SHOW_WIF, MODAL_WIPE, MODAL_SHOW_WIF } from '../../constants/ModalConstants';
import { toastError } from '../../helpers/ToastHelper';
import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { asyncUnlock } from '../../actions/AuthActions';

import Services from '../../services';

class PrivateKeyScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			publicKey: '',
			wif: ''
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

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	showWif(publicKey) {
		this.setState({ password: '', publicKey });
		this.props.openModal(MODAL_UNLOCK_SHOW_WIF);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK_SHOW_WIF].get('error')) {
			this.props.clear(MODAL_UNLOCK_SHOW_WIF);
		}
	}

	unlock() {
		const { password } = this.state;

		this.props.asyncUnlock(password, async () => {
			await this.setWIFKey();
			this.props.openModal(MODAL_SHOW_WIF);
		}, MODAL_UNLOCK_SHOW_WIF);
	}

	close(modal) {
		this.setState({ password: '', publicKey: '' });
		this.props.closeModal(modal);
	}

	forgot() {
		this.setState({ password: '' });
		this.props.closeModal(MODAL_UNLOCK_SHOW_WIF);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK_SHOW_WIF]: modalShowWifUnlockUnlock,
			[MODAL_SHOW_WIF]: modalShowWif,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.showWif.bind(this))}
				<ModalUnlock
					show={modalShowWifUnlockUnlock.get('show')}
					disabled={modalShowWifUnlockUnlock.get('loading')}
					error={modalShowWifUnlockUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					close={() => this.close(MODAL_UNLOCK_SHOW_WIF)}
					forgot={() => this.forgot()}
				/>
				<ModalShowWif
					show={modalShowWif.get('show')}
					disabled={modalShowWif.get('loading')}
					error={modalShowWif.get('error')}
					saveAsTxt={(backupInfo) => this.saveAsTxt(backupInfo)}
					close={() => this.close(MODAL_SHOW_WIF)}
					keys={this.state}
				/>
			</React.Fragment>
		);
	}

}

PrivateKeyScenario.propTypes = {
	children: PropTypes.func.isRequired,

	[MODAL_UNLOCK_SHOW_WIF]: PropTypes.object.isRequired,
	[MODAL_SHOW_WIF]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	asyncUnlock: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		[MODAL_UNLOCK_SHOW_WIF]: state.modal.get(MODAL_UNLOCK_SHOW_WIF),
		[MODAL_SHOW_WIF]: state.modal.get(MODAL_SHOW_WIF),
	}),
	(dispatch) => ({
		openModal: (modal, params) => dispatch(openModal(modal, params)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		clear: (modal) => dispatch(setError(modal, null)),
		asyncUnlock: (password, callback) => dispatch(asyncUnlock(password, callback, MODAL_UNLOCK_SHOW_WIF)),
	}),
)(PrivateKeyScenario);

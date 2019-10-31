import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalBackup from '../../components/Modals/ModalBackup';

import { MODAL_UNLOCK_BACKUP, MODAL_WIPE, MODAL_BACKUP } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { asyncUnlock } from '../../actions/AuthActions';

import Services from '../../services';

class BackupKeysScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			activeUserKeys: [],
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK_BACKUP].get('error')) {
			this.props.clearError(MODAL_UNLOCK_BACKUP);
		}
	}

	async fetchWIFs(password) {
		const { active: { keys } } = this.props.permissionsKeys.toJS();

		const userStorage = Services.getUserStorage();

		const activeUserKeys = await Promise.all(keys.map(async (keyItem) => {
			const wif = await userStorage.getWIFByPublicKey(keyItem.key, { password });
			if (!wif) {
				return { publicKey: keyItem.key };
			}

			return wif;
		}));

		this.setState((prevState) => ({
			...prevState,
			activeUserKeys: [...prevState.activeUserKeys, ...activeUserKeys],
		}));
	}

	unlock() {
		const { password } = this.state;

		this.props.asyncUnlock(password, async () => {
			await this.fetchWIFs(password);
			this.props.openModal(MODAL_BACKUP);
		}, MODAL_UNLOCK_BACKUP);
	}

	backup() {
		this.props.openModal(MODAL_UNLOCK_BACKUP);
	}

	async saveAsTxt(activeKeysString) {
		const donwloadElement = document.createElement('a');
		const txtFile = new Blob([activeKeysString], { type: 'text/plain' });
		donwloadElement.href = URL.createObjectURL(txtFile);
		donwloadElement.download = 'echo-backup.txt';
		donwloadElement.click();
	}

	close(modal) {
		this.clear();
		this.props.closeModal(modal);
	}

	forgot() {
		this.clear();
		this.props.closeModal(MODAL_UNLOCK_BACKUP);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK_BACKUP]: modalUnlockBackup,
			[MODAL_BACKUP]: modalBackup,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.backup.bind(this))}
				<ModalUnlock
					show={modalUnlockBackup.get('show')}
					disabled={modalUnlockBackup.get('loading')}
					error={modalUnlockBackup.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					forgot={() => this.forgot()}
					close={() => this.close(MODAL_UNLOCK_BACKUP)}
				/>
				<ModalBackup
					activeUser={this.props.activeUser}
					show={modalBackup.get('show')}
					disabled={modalBackup.get('loading')}
					saveAsTxt={(backupInfo) => this.saveAsTxt(backupInfo)}
					close={() => this.close(MODAL_BACKUP)}
					keys={this.state.activeUserKeys}
				/>
			</React.Fragment>
		);
	}

}

BackupKeysScenario.propTypes = {
	children: PropTypes.func.isRequired,
	permissionsKeys: PropTypes.object,

	activeUser: PropTypes.object,
	[MODAL_UNLOCK_BACKUP]: PropTypes.object.isRequired,
	[MODAL_BACKUP]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	asyncUnlock: PropTypes.func.isRequired,
};

BackupKeysScenario.defaultProps = {
	activeUser: {},
	permissionsKeys: {},
};

export default connect(
	(state) => ({
		activeUser: state.global.get('activeUser'),
		[MODAL_UNLOCK_BACKUP]: state.modal.get(MODAL_UNLOCK_BACKUP),
		[MODAL_BACKUP]: state.modal.get(MODAL_BACKUP),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		asyncUnlock: (password, callback) =>
			dispatch(asyncUnlock(password, callback, MODAL_UNLOCK_BACKUP)),
	}),
)(BackupKeysScenario);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalBackupKeys from '../../components/Modals/ModalBackupKeys';

import { MODAL_UNLOCK_PERMISSION, MODAL_WIPE, MODAL_BACKUP_KEYS } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';

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

		if (this.props[MODAL_UNLOCK_PERMISSION].get('error')) {
			this.props.clearError(MODAL_UNLOCK_PERMISSION);
		}
	}

	async fetchWIFs(password) {
		const { active: { keys } } = this.props.permissionsKeys.toJS();

		const userStorage = Services.getUserStorage();


		const activeUserKeys = await Promise.all(keys.map((keyItem) =>
			userStorage.getWIFByPublicKey(keyItem.key, { password })));

		this.setState((prevState) => ({
			...prevState,
			activeUserKeys: [...prevState.activeUserKeys, ...activeUserKeys],
		}));
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, async () => {
			await this.fetchWIFs(password);
			this.props.openModal(MODAL_BACKUP_KEYS);
		});
	}

	backup() {
		this.props.openModal(MODAL_UNLOCK_PERMISSION);
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
		this.props.closeModal(MODAL_UNLOCK_PERMISSION);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK_PERMISSION]: modalUnlock,
			[MODAL_BACKUP_KEYS]: modalBackupKeys,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.backup.bind(this))}
				<ModalUnlock
					show={modalUnlock.get('show')}
					disabled={modalUnlock.get('loading')}
					error={modalUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					forgot={() => this.forgot()}
					close={() => this.close(MODAL_UNLOCK_PERMISSION)}
				/>
				<ModalBackupKeys
					activeUser={this.props.activeUser}
					show={modalBackupKeys.get('show')}
					disabled={modalBackupKeys.get('loading')}
					saveAsTxt={(backupInfo) => this.saveAsTxt(backupInfo)}
					close={() => this.close(MODAL_BACKUP_KEYS)}
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
	[MODAL_UNLOCK_PERMISSION]: PropTypes.object.isRequired,
	[MODAL_BACKUP_KEYS]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
};

BackupKeysScenario.defaultProps = {
	activeUser: {},
	permissionsKeys: {},
};

export default connect(
	(state) => ({
		activeUser: state.global.get('activeUser'),
		[MODAL_UNLOCK_PERMISSION]: state.modal.get(MODAL_UNLOCK_PERMISSION),
		[MODAL_BACKUP_KEYS]: state.modal.get(MODAL_BACKUP_KEYS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback, MODAL_UNLOCK_PERMISSION)),
	}),
)(BackupKeysScenario);

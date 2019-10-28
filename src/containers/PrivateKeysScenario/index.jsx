import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalEditPermissions from '../../components/Modals/ModalEditPermissions';
import { MODAL_UNLOCK_PERMISSION, MODAL_WIPE, MODAL_BACKUP_KEYS, MODAL_EDIT_PERMISSIONS } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';

import Services from '../../services';

class PrivateKeysScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			// keys: [],
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	getKeys() {
		this.props.openModal(MODAL_EDIT_PERMISSIONS);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_EDIT_PERMISSIONS].get('error')) {
			this.props.clearError(MODAL_EDIT_PERMISSIONS);
		}
	}

	async fetchWIFs(password) {
		const { activeUserId } = this.props;

		if (!activeUserId) {
			return;
		}

		const userStorage = Services.getUserStorage();

		const keys = await userStorage.getAllWIFKeysForAccount(activeUserId, { password });

		this.props.onKeys(keys);
		// this.setState((prevState) => ({
		// 	...prevState,
		// 	keys: [...keys],
		// }));
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, async () => {
			await this.fetchWIFs(password);
		}, MODAL_EDIT_PERMISSIONS);
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	close(modal) {
		this.clear();
		this.props.closeModal(modal);
	}

	forgot() {
		this.clear();
		this.props.closeModal(MODAL_EDIT_PERMISSIONS);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			// [MODAL_UNLOCK_PERMISSION]: modalUnlock,
			[MODAL_EDIT_PERMISSIONS]: modalEditPermissions,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.getKeys.bind(this))}
				<ModalEditPermissions
					show={modalEditPermissions.get('show')}
					disabled={modalEditPermissions.get('loading')}
					error={modalEditPermissions.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					forgot={() => this.forgot()}
					close={() => this.close(MODAL_EDIT_PERMISSIONS)}
					warningTime={7}
				/>
			</React.Fragment>
		);
	}

}

PrivateKeysScenario.propTypes = {
	children: PropTypes.func.isRequired,
	activeUserId: PropTypes.string,
	[MODAL_EDIT_PERMISSIONS]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	onKeys: PropTypes.func.isRequired,
};

PrivateKeysScenario.defaultProps = {
	activeUserId: null,
};

export default connect(
	(state) => ({
		activeUserId: state.global.getIn(['activeUser', 'id']),
		[MODAL_EDIT_PERMISSIONS]: state.modal.get(MODAL_EDIT_PERMISSIONS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback, MODAL_EDIT_PERMISSIONS)),
	}),
)(PrivateKeysScenario);

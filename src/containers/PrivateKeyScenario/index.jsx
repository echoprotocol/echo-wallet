import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';

import { MODAL_UNLOCK_PERMISSION, MODAL_WIPE } from '../../constants/ModalConstants';
import { toastError } from '../../helpers/ToastHelper';
import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';

import Services from '../../services';

class PrivateKeyScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			publicKey: '',
			keys: [],
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

		this.setState((prevState) => ({
			...prevState,
			password: '',
			publicKey: '',
			keys: [...prevState.keys, { publicKey, wif: key.wif }],
		}));
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	submit(role, publicKey) {
		const unlocked = this.state.keys.find((k) => k.publicKey === publicKey);

		if (unlocked) {
			this.setState((prevState) => ({
				...prevState,
				keys: prevState.keys.filter((k) => k.publicKey !== publicKey),
			}));
			return;
		}

		this.setState({ password: '', publicKey });
		this.props.openModal(MODAL_UNLOCK_PERMISSION);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK_PERMISSION].get('error')) {
			this.props.clear(MODAL_UNLOCK_PERMISSION);
		}
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, this.setWIFKey.bind(this));
	}

	close(modal) {
		this.setState({ password: '', publicKey: '' });
		this.props.closeModal(modal);
	}

	forgot() {
		this.setState({ password: '' });
		this.props.closeModal(MODAL_UNLOCK_PERMISSION);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK_PERMISSION]: modalUnlock,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.state.keys, this.submit.bind(this))}
				<ModalUnlock
					show={modalUnlock.get('show')}
					disabled={modalUnlock.get('loading')}
					error={modalUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					close={() => this.close(MODAL_UNLOCK_PERMISSION)}
					forgot={() => this.forgot()}
				/>
			</React.Fragment>
		);
	}

}

PrivateKeyScenario.propTypes = {
	children: PropTypes.func.isRequired,

	[MODAL_UNLOCK_PERMISSION]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
};


export default connect(
	(state) => ({
		[MODAL_UNLOCK_PERMISSION]: state.modal.get(MODAL_UNLOCK_PERMISSION),
	}),
	(dispatch) => ({
		openModal: (modal, params) => dispatch(openModal(modal, params)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		clear: (modal) => dispatch(setError(modal, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback, MODAL_UNLOCK_PERMISSION)),
	}),
)(PrivateKeyScenario);

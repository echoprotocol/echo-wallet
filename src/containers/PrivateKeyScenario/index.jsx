import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { PrivateKey } from 'echojs-lib';

import ModalUnlock from '../../components/Modals/ModalUnlock';

import { MODAL_UNLOCK_PERMISSION } from '../../constants/ModalConstants';
import { openModal, closeModal } from '../../actions/ModalActions';
import { unlockAccount } from '../../actions/AuthActions';

import Services from '../../services';

class PrivateKeyScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			error: null,
			active: [],
			note: [],
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	async submit(role, publicKey) {
		if (role === 'memo' && !this.state[role]) {
			role = 'note';
		}

		if (this.state[role].find((k) => k.publicKey === publicKey)) {
			return this.setState({
				[role]: this.state[role].filter(((k) => k.publicKey !== publicKey)),
			});
		}

		const userStorage = Services.getUserStorage();
		const key = await userStorage.getWIFByPublicKey(publicKey, { password: '123123' });

		if (!key) {
			return null;
		}

		const privateKey = PrivateKey.fromWif(key.wif).toHex();

		if (!privateKey) {
			return this.props.openModal({ role, publicKey });
		}

		return this.setState({
			[role]: [...this.state[role], { publicKey, privateKey }],
		});
	}

	change(value) {
		this.setState({ password: value, error: null });
	}

	unlock() {
		const { password } = this.state;
		const { account, role, publicKey } = this.props;

		const { keys, error } = this.props.unlockAccount(account, password);
		if (error) {
			return this.setState({ error });
		}

		const key = role !== 'note' ? keys[role] : keys.memo;
		if (key.publicKey !== publicKey) {
			return this.setState({ error: 'Invalid password' });
		}

		this.setState({
			[role]: [
				...this.state[role],
				{ publicKey, privateKey: key.privateKey.toWif() },
			],
			password: '',
		});

		return this.props.closeModal();
	}

	close() {
		const { role, publicKey } = this.props;

		this.setState({
			[role]: this.state[role].filter(((k) => k.publicKey !== publicKey)),
			password: '',
			error: null,
		});

		this.props.closeModal();
	}

	render() {
		return (
			<React.Fragment>
				{this.props.children(this.state, this.submit.bind(this))}
				<ModalUnlock
					show={this.props.show}
					disabled={this.props.disabled}
					password={this.state.password}
					error={this.state.error}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					close={() => this.close()}
				/>
			</React.Fragment>
		);
	}

}

PrivateKeyScenario.propTypes = {
	children: PropTypes.func.isRequired,
	account: PropTypes.object,
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	role: PropTypes.string,
	publicKey: PropTypes.string,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
};

PrivateKeyScenario.defaultProps = {
	account: {},
	show: false,
	disabled: false,
	role: null,
	publicKey: null,
};

export default connect(
	(state) => ({
		account: state.echojs.getIn(['data', 'accounts', state.global.getIn(['activeUser', 'id'])]),
		show: state.modal.getIn([MODAL_UNLOCK_PERMISSION, 'show']),
		disabled: state.modal.getIn([MODAL_UNLOCK_PERMISSION, 'disabled']),
		role: state.modal.getIn([MODAL_UNLOCK_PERMISSION, 'role']),
		publicKey: state.modal.getIn([MODAL_UNLOCK_PERMISSION, 'publicKey']),
	}),
	(dispatch) => ({
		openModal: (params) => dispatch(openModal(MODAL_UNLOCK_PERMISSION, params)),
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK_PERMISSION)),
		unlockAccount: (account, password) => dispatch(unlockAccount(account, password)),
	}),
)(PrivateKeyScenario);

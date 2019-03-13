import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';

import { MODAL_UNLOCK } from '../../constants/ModalConstants';
import { openModal, closeModal } from '../../actions/ModalActions';
import { getPrivateKey } from '../../actions/KeyChainActions';
import { unlockAccount } from '../../actions/AuthActions';

import { decodeMemo } from '../../api/TransactionApi';

class NoteScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			error: null,
			note: null,
			memo: null,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	decodeMemo(memo, privateKey) {
		const publicKey = privateKey.toPublicKey().toString();

		if (publicKey !== memo.from && publicKey !== memo.to) {
			return null;
		}

		return decodeMemo(memo, privateKey);
	}

	submit(memo) {
		this.setState({ memo });

		const fromPrivateKey = this.props.getPrivateKey(memo.from);
		const toPrivateKey = this.props.getPrivateKey(memo.to);

		if (!fromPrivateKey && !toPrivateKey) {
			return this.props.openModal();
		}

		const note = this.decodeMemo(memo, fromPrivateKey || toPrivateKey);
		return note ? this.setState({ note }) : this.props.openModal();
	}

	change(value) {
		this.setState({ password: value, error: null });
	}

	unlock() {
		const { password, memo } = this.state;
		const { account } = this.props;

		const { error, keys } = this.props.unlockAccount(account, password);
		if (error) {
			return this.setState({ error });
		}

		if (!keys.memo) {
			return this.setState({ error: 'Invalid password' });
		}

		const note = this.decodeMemo(memo, keys.memo.privateKey);

		if (note) {
			this.props.closeModal();
		}

		return this.setState(note ? { note } : { error: 'Invalid password' });
	}

	close() {
		this.clear();
		this.props.closeModal();
	}

	render() {
		return (
			<React.Fragment>
				{this.props.children(this.state.note, this.submit.bind(this))}
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

NoteScenario.propTypes = {
	children: PropTypes.func.isRequired,
	account: PropTypes.object,
	show: PropTypes.bool,
	disabled: PropTypes.bool,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	getPrivateKey: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
};

NoteScenario.defaultProps = {
	account: {},
	show: false,
	disabled: false,
};

export default connect(
	(state) => ({
		account: state.echojs.getIn(['data', 'accounts', state.global.getIn(['activeUser', 'id'])]),
		show: state.modal.getIn([MODAL_UNLOCK, 'show']),
		disabled: state.modal.getIn([MODAL_UNLOCK, 'disabled']),
	}),
	(dispatch) => ({
		openModal: (params) => dispatch(openModal(MODAL_UNLOCK, params)),
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK)),
		getPrivateKey: (publicKey) => dispatch(getPrivateKey(publicKey)),
		unlockAccount: (account, password) => dispatch(unlockAccount(account, password)),
	}),
)(NoteScenario);

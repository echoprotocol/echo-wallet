import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';

import operations from '../../constants/Operations';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../../constants/ModalConstants';
import { openModal, closeModal } from '../../actions/ModalActions';
import { getPrivateKey } from '../../actions/KeyChainActions';
import { unlockAccount } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

class TransactionScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			error: null,
			active: [],
			owner: [],
			memo: null,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
		this.props.resetTransaction();
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	async submit() {
		const isValid = await this.props.handleTransaction();

		if (!isValid) {
			return null;
		}

		const { account, operation, showOptions } = this.props;

		const permissionPrivateKeys = account.getIn([operations[operation].permission, 'key_auths'])
			.reduce((arr, [publicKey, weight]) => {
				const privateKey = this.props.getPrivateKey(publicKey);
				if (privateKey) { arr.push([privateKey, weight]); }
				return arr;
			}, []);

		if (!permissionPrivateKeys.length) {
			return this.props.openModal(MODAL_UNLOCK);
		}

		this.setState({ [operations[operation].permission]: permissionPrivateKeys });

		if (operations[operation].value === operations.transfer.value && showOptions.note) {
			const memoPrivateKey = this.props.getPrivateKey(account.getIn(['options', 'memo_key']));

			if (!memoPrivateKey) {
				return this.props.openModal(MODAL_UNLOCK);
			}

			this.setState({ memo: memoPrivateKey });
		}

		return this.props.openModal(MODAL_DETAILS);
	}

	change(value) {
		this.setState({ password: value, error: null });
	}

	unlock() {
		const { password } = this.state;
		const { account, operation, showOptions } = this.props;

		const { keys, error } = this.props.unlockAccount(account, password);
		if (error) {
			return this.setState({ error });
		}

		const { permission } = operations[operation];
		const permissionPrivateKeys = account.getIn([permission, 'key_auths'])
			.reduce((arr, [publicKey, weight]) => {
				if (keys[permission] && keys[permission].publicKey === publicKey) {
					arr.push([keys[permission].privateKey, weight]);
				}
				return arr;
			}, []);

		if (!permissionPrivateKeys.length && !this.state[permission].length) {
			return this.setState({ error: `${permission} permissions required` });
		}

		this.setState({ [permission]: permissionPrivateKeys });

		if (operations[operation].value === operations.transfer.value && showOptions.get('note')) {

			if (!keys.memo || (keys.memo.publicKey !== account.getIn(['options', 'memo_key']) && !this.state.memo)) {
				return this.setState({ error: 'Note permission required' });
			}

			this.setState(keys.memo ? { memo: keys.memo.privateKey } : {});
		}

		this.props.closeModal(MODAL_UNLOCK);
		return this.props.openModal(MODAL_DETAILS);
	}

	send() {
		const { active, owner, memo } = this.state;

		this.props.sendTransaction({ active, owner, memo });
		this.clear();
	}

	close() {
		this.clear();
		this.props.closeModal(MODAL_UNLOCK);
		this.props.closeModal(MODAL_DETAILS);
	}

	render() {
		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalUnlock
					show={this.props[MODAL_UNLOCK].get('show')}
					disabled={this.props[MODAL_UNLOCK].get('disabled')}
					password={this.state.password}
					error={this.state.error}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					close={() => this.close()}
				/>
				<ModalApprove
					show={this.props[MODAL_DETAILS].get('show')}
					disabled={this.props[MODAL_DETAILS].get('disabled')}
					operation={this.props.operation}
					showOptions={this.props.showOptions}
					send={(value) => this.send(value)}
					close={() => this.close()}
				/>
			</React.Fragment>
		);
	}

}

TransactionScenario.propTypes = {
	children: PropTypes.func.isRequired,
	account: PropTypes.object,
	operation: PropTypes.string,
	showOptions: PropTypes.object,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	getPrivateKey: PropTypes.func.isRequired,
	handleTransaction: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
};

TransactionScenario.defaultProps = {
	account: {},
	operation: null,
	showOptions: {},
};

export default connect(
	(state) => ({
		account: state.echojs.getIn(['data', 'accounts', state.global.getIn(['activeUser', 'id'])]),
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		getPrivateKey: (publicKey) => dispatch(getPrivateKey(publicKey)),
		unlockAccount: (account, password) => dispatch(unlockAccount(account, password)),
		sendTransaction: (keys) => dispatch(sendTransaction(keys)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(TransactionScenario);

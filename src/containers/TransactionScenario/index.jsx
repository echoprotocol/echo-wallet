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
import { clearForm } from '../../actions/FormActions';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class TransactionScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			showUnlockModal: false,
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
		const { permission } = operations[operation];

		const permissionPrivateKeys = account.getIn([permission, 'key_auths'])
			.reduce((arr, [publicKey, weight]) => {
				const privateKey = this.props.getPrivateKey(publicKey);
				if (privateKey) { arr.push([privateKey, weight]); }
				return arr;
			}, []);

		if (!permissionPrivateKeys.length) {
			return this.setState({ showUnlockModal: true });
		}

		const threshold = account.getIn([permission, 'weight_threshold']);
		const totalWeight = permissionPrivateKeys.reduce((result, [, weight]) => result + weight, 0);

		this.setState({ [permission]: permissionPrivateKeys, weight: totalWeight, threshold });

		if (operations[operation].value === operations.transfer.value && showOptions.note) {
			const memoPrivateKey = this.props.getPrivateKey(account.getIn(['options', 'memo_key']));

			if (!memoPrivateKey) {
				return this.setState({ showUnlockModal: true });
			}

			this.setState({ memo: memoPrivateKey });
		}

		return this.setState({ showUnlockModal: false, password: this.DEFAULT_STATE.password }, () => {
			if (totalWeight < threshold) {
				return this.setState({ showUnlockModal: true });
			}

			return this.props.openModal(MODAL_DETAILS);
		});
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
		const stateKeys = this.state[permission];

		const isKeyAdded = stateKeys.find(([privateKey]) =>
			keys[permission] && keys[permission].privateKey.toWif() === privateKey.toWif());

		if (isKeyAdded) {
			return this.setState({ error: 'Key already added' });
		}

		const permissionPrivateKey = account.getIn([permission, 'key_auths'])
			.find(([publicKey]) => keys[permission] && keys[permission].publicKey === publicKey);


		if (!permissionPrivateKey) {
			if (this.state[permission].length === 0) {
				return this.setState({ error: `${permission} permissions required` });
			}
		} else {
			stateKeys.push([keys[permission].privateKey, permissionPrivateKey.get(1)]);
		}

		const threshold = account.getIn([permission, 'weight_threshold']);
		const totalWeight = stateKeys.reduce((result, [, weight]) => result + weight, 0);

		this.setState({ [permission]: stateKeys, weight: totalWeight, threshold });

		if (operations[operation].value === operations.transfer.value && showOptions.get('note') && !this.state.memo) {
			if (!keys.memo || (keys.memo.publicKey !== account.getIn(['options', 'memo_key']))) {
				return this.setState({ error: 'Note permission required' });
			}

			this.setState(keys.memo ? { memo: keys.memo.privateKey } : {});
		}

		return this.setState({ showUnlockModal: false, password: this.DEFAULT_STATE.password }, () => {
			if (totalWeight < threshold) {
				return this.setState({ showUnlockModal: true });
			}

			return this.props.openModal(MODAL_DETAILS);
		});

	}

	send() {
		const { active, owner, memo } = this.state;

		this.props.sendTransaction({ active, owner, memo });
		this.clear();
		this.props.clearForm();
	}

	close() {
		this.clear();
		this.setState({ showUnlockModal: false, weight: null });

		this.props.closeModal(MODAL_DETAILS);
	}

	render() {
		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalUnlock
					weight={this.state.weight}
					threshold={this.state.threshold}
					show={this.state.showUnlockModal}
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
	externalAccountId: PropTypes.string, // eslint-disable-line
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	getPrivateKey: PropTypes.func.isRequired,
	handleTransaction: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

TransactionScenario.defaultProps = {
	account: {},
	operation: null,
	showOptions: {},
	externalAccountId: '',
};

export default connect(
	(state, props) => ({
		account: state.echojs.getIn(['data', 'accounts', props.externalAccountId || state.global.getIn(['activeUser', 'id'])]),
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
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
	}),
)(TransactionScenario);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { PrivateKey } from 'echojs-lib';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';
import operations from '../../constants/Operations';
import { COMMITTEE_TABLE } from '../../constants/TableConstants';
import { FORM_COMMITTEE } from '../../constants/FormConstants';
import { MODAL_UNLOCK, MODAL_DETAILS } from '../../constants/ModalConstants';
import { setValue as setTableValue } from '../../actions/TableActions';
import { openModal, closeModal } from '../../actions/ModalActions';
import { unlockAccount } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';
import { clearForm } from '../../actions/FormActions';

import Services from '../../services';

class TransactionScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			showUnlockModal: false,
			password: '',
			error: null,
			active: [],
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

		const { account, operation } = this.props;
		const { permission } = operations[operation];
		const userStorage = Services.getUserStorage();
		const permissionPrivateKeys = await account.getIn([permission, 'key_auths'])
			.reduce(async (arr, [publicKey, weight]) => {
				const key = await userStorage.getWIFByPublicKey(publicKey, { password: '123123' });

				if (!key) {
					return null;
				}

				const privateKey = PrivateKey.fromWif(key.wif).toHex();

				if (privateKey) { arr.push([privateKey, weight]); }
				return arr;
			}, []);

		if (!permissionPrivateKeys.length) {
			return this.setState({ showUnlockModal: true });
		}
		const threshold = account.getIn([permission, 'weight_threshold']);
		const totalWeight = permissionPrivateKeys.reduce((result, [, weight]) => result + weight, 0);
		this.setState({ [permission]: permissionPrivateKeys, weight: totalWeight, threshold });

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
		const { account, operation } = this.props;

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

		return this.setState({ showUnlockModal: false, password: this.DEFAULT_STATE.password }, () => {
			if (totalWeight < threshold) {
				return this.setState({ showUnlockModal: true });
			}

			return this.props.openModal(MODAL_DETAILS);
		});

	}

	send() {
		const { active } = this.state;
		const { form } = this.props;

		this.props.sendTransaction({ active });
		this.clear();

		if (form) {
			this.props.clearForm();
			if (form === FORM_COMMITTEE) {
				this.props.disabledInput();
			}
		}
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
	form: PropTypes.string, // eslint-disable-line
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	handleTransaction: PropTypes.func.isRequired,
	unlockAccount: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	disabledInput: PropTypes.func.isRequired,
};

TransactionScenario.defaultProps = {
	account: {},
	operation: null,
	showOptions: {},
	externalAccountId: '',
	form: '',
};

export default connect(
	(state, props) => ({
		account: state.echojs.getIn(['data', 'accounts', props.externalAccountId || state.global.getIn(['activeUser', 'id'])]),
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
	}),
	(dispatch, props) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		unlockAccount: (account, password) => dispatch(unlockAccount(account, password)),
		sendTransaction: (keys) => dispatch(sendTransaction(keys)),
		resetTransaction: () => dispatch(resetTransaction()),
		clearForm: () => dispatch(clearForm(props.form)),
		disabledInput: () => dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', true)),
	}),
)(TransactionScenario);

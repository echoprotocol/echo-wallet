/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';
import ModalConfirmChangeTreshold from '../../components/Modals/ModalConfirmChangeTreshold';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE, MODAL_CONFIRM_CHANGE_TRESHOLD } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';
import { toastError } from '../../helpers/ToastHelper';

class WarningConfirmThresholdScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			warningMessage: '',
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

	async submit(onFinish) {
		const isValid = await this.props.handleTransaction();
		if (!isValid) {
			return;
		}
		const permissionsKeys = this.props.form.toJS();
		const activeAccounts = this.props.activeAccounts.toJS();
		const nextTreshold = this.props.treshold.value;
		const { keys, accounts } = permissionsKeys.active;
		let goodNextThreshold = 0;
		let maxNextThreshold = 0;
		for (const key in keys) {
			maxNextThreshold += (+keys[key].weight.value);
			if (keys[key].hasWif && keys[key].hasWif.value) {
				goodNextThreshold += (+keys[key].weight.value);
			}
		}
		for (const account in accounts) {
			maxNextThreshold += (+accounts[account].weight.value);
			for (const activeAccount in activeAccounts) {
				if (activeAccount === account) {
					console.log(accounts[account].weight.value)
					goodNextThreshold += (+accounts[account].weight.value);
				}
			}
		}
		console.log(maxNextThreshold, goodNextThreshold);
		// const { echoRand } = permissionsKeys;
		// for (const key in echoRand.keys) {
		// 	console.log(1)
		// 	if (!echoRand.keys[key].hasWif && !echoRand.keys[key].hasWif.value) {
		// 		console.log(2)
		// 		this.setState({
		// 			warningMessage: `${this.state.warningMessage}
		// 				You remove your EchoRandKey and now will lose acces to it.`,
		// 		});
		// 	}
		// }
		if (maxNextThreshold < nextTreshold) {
			this.props.closeModal(MODAL_UNLOCK);
			toastError('Threshold is too big. You do not have that much private key weight');
		} else if (nextTreshold > goodNextThreshold) {
			this.setState({
				warningMessage: `${this.state.warningMessage} If these changes are applied, you won't have enough keys to sign transactions. Do you want to proceed?`,
			});
			this.props.openModal(MODAL_CONFIRM_CHANGE_TRESHOLD);
		} else {
			this.props.openModal(MODAL_UNLOCK);
		}
		if (typeof onFinish === 'function') {
			onFinish();
		}
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK].get('error')) {
			this.props.clearError(MODAL_UNLOCK);
		}
	}

	async unlock() {
		const { password } = this.state;
		const { onUnlock } = this.props;

		this.props.unlock(password, () => {
			onUnlock(password);
			this.props.openModal(MODAL_DETAILS);
		});


	}
	open(modal) {
		this.props.openModal(modal);
	}
	send() {
		const { password } = this.state;

		this.props.sendTransaction(password);
		this.clear();
	}

	close(modal) {
		this.clear();
		this.props.closeModal(modal);
	}

	forgot() {
		this.clear();
		this.props.closeModal(MODAL_UNLOCK);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK]: modalUnlock,
			[MODAL_DETAILS]: modalDetails,
			[MODAL_CONFIRM_CHANGE_TRESHOLD]: modalConfirmChangeTreshold,
		} = this.props;
		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalConfirmChangeTreshold
					show={modalConfirmChangeTreshold.get('show')}
					confirm={() => {
						this.open(MODAL_UNLOCK);
						this.close(MODAL_CONFIRM_CHANGE_TRESHOLD);
					}}
					close={() => this.close(MODAL_CONFIRM_CHANGE_TRESHOLD)}
					warningMessage={this.state.warningMessage}
				/>
				<ModalUnlock
					show={modalUnlock.get('show')}
					disabled={modalUnlock.get('loading')}
					error={modalUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					forgot={() => this.forgot()}
					close={() => this.close(MODAL_UNLOCK)}
				/>
				<ModalApprove
					show={modalDetails.get('show')}
					disabled={modalDetails.get('loading')}
					operation={this.props.operation}
					showOptions={this.props.showOptions}
					send={(value) => this.send(value)}
					close={() => this.close(MODAL_DETAILS)}
				/>
			</React.Fragment>
		);
	}

}

WarningConfirmThresholdScenario.propTypes = {
	handleTransaction: PropTypes.func.isRequired,
	children: PropTypes.func.isRequired,

	operation: PropTypes.string,
	showOptions: PropTypes.object,
	[MODAL_UNLOCK]: PropTypes.object.isRequired,
	[MODAL_DETAILS]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	treshold: PropTypes.object.isRequired,
	activeAccounts: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
	onUnlock: PropTypes.func,
};

WarningConfirmThresholdScenario.defaultProps = {
	operation: null,
	showOptions: {},
	onUnlock: () => { },
};

export default connect(
	(state) => ({
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		form: state.form.get(FORM_PERMISSION_KEY),
		treshold: state.form.getIn([FORM_PERMISSION_KEY, 'active', 'threshold']),
		activeAccounts: state.echojs.getIn(['accountsByName']),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
		[MODAL_CONFIRM_CHANGE_TRESHOLD]: state.modal.get(MODAL_CONFIRM_CHANGE_TRESHOLD),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback)),
		sendTransaction: (keys) => dispatch(sendTransaction(keys)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(WarningConfirmThresholdScenario);

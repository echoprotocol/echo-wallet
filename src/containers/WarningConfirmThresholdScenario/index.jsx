import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';
import ModalConfirmChangeTreshold from '../../components/Modals/ModalConfirmChangeTreshold';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE, MODAL_CONFIRM_CHANGE_TRESHOLD } from '../../constants/ModalConstants';
import { PERMISSION_TABLE } from '../../constants/TableConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';
import { toastError } from '../../helpers/ToastHelper';
import { checkKeyWeightWarning } from '../../actions/BalanceActions';

class WarningConfirmThresholdScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
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
		const nextTreshold = this.props.treshold.value;
		let { permissionsKeys } = this.props;
		const { network, account } = this.props;
		const accountId = account.toJS().id;
		permissionsKeys = permissionsKeys.toJS();
		const activeKeysData = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};
		const maxNextThreshold = activeKeysData.keys
			.reduce((accumulator, currentKey) => accumulator + currentKey.weight, 0);
		if (maxNextThreshold < nextTreshold) {
			this.props.closeModal(MODAL_UNLOCK);
			toastError('Threshold is too big. You do not have that much private key weight');
		} else {
			const isNextThresholdGood =
                !(await this.props.checkThreshold(network, accountId, nextTreshold));
			if (isNextThresholdGood) {
				this.props.openModal(MODAL_UNLOCK);
			} else {
				this.props.openModal(MODAL_CONFIRM_CHANGE_TRESHOLD);
			}
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
					confirm={() => this.open(MODAL_CONFIRM_CHANGE_TRESHOLD)}
					close={() => this.close(MODAL_CONFIRM_CHANGE_TRESHOLD)}
				/>
				<ModalUnlock
					show={modalUnlock.get('show')}
					disabled={modalUnlock.get('loading')}
					error={modalUnlock.get('error')}
					password={this.state.password}
					change={(value) => this.change(value)}
					unlock={() => this.unlock(true)}
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
	checkThreshold: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	treshold: PropTypes.object.isRequired,
	account: PropTypes.object.isRequired,
	network: PropTypes.string.isRequired,
	onUnlock: PropTypes.func,
};

WarningConfirmThresholdScenario.defaultProps = {
	operation: null,
	showOptions: {},
	onUnlock: () => {},
};

export default connect(
	(state) => ({
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		treshold: state.form.getIn([FORM_PERMISSION_KEY, 'active', 'threshold']),
		permissionsKeys: state.table.get(PERMISSION_TABLE),
		account: state.global.getIn(['activeUser']),
		network: state.global.getIn(['network', 'name']),
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
		checkThreshold: (network, accountId, nextTreshold) =>
			dispatch(checkKeyWeightWarning(network, accountId, nextTreshold)),
	}),
)(WarningConfirmThresholdScenario);

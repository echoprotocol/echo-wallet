/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import BN from 'bignumber.js';


import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';
import ModalConfirmEditingOfPermissions from '../../components/Modals/ModalConfirmEditingOfPermissions';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE, MODAL_CONFIRM_EDITING_OF_PERMISSIONS } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';

import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

import { FORM_PERMISSION_KEY, FORM_PERMISSION_TRESHOLD_SUM_ERROR, REPEATING_KEYS_ERROR } from '../../constants/FormConstants';
import { setInFormError, setValue } from '../../actions/FormActions';
import { setValue as setTableValue } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';


class WarningConfirmThresholdScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			warningMessage: '',
			echoRandMessage: '',
			isWifChangingOnly: false,
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
	isRepeat(keys, accounts) {
		const items = [];
		const repeatingItems = [];
		for (const key in keys) {
			items.push({
				index: key,
				value: keys[key].key.value,
				type: 'keys',
			});
		}
		for (const account in accounts) {
			items.push({
				index: account,
				value: accounts[account].key.value,
				type: 'accounts',
			});
		}
		for (let i = 0; i < items.length; i += 1) {
			for (let j = i + 1; j < items.length; j += 1) {
				if (items[i].value === items[j].value) {
					repeatingItems.push(items[j]);
					break;
				}
			}
		}
		return repeatingItems;
	}
	async submit(onFinish) {
		try {
			const { validation, isWifChangingOnly } = await this.props.handleTransaction();
			if (!validation) {
				return;
			}
			this.setState({ isWifChangingOnly });

		} catch (error) {
			return;
		}

		const permissionsKeys = this.props.form.toJS();
		const network = this.props.network.toJS();
		const accs = JSON.parse(localStorage.getItem(`accounts_${network.name}`));
		const nextTreshold = new BN(this.props.treshold.value);
		const { keys, accounts } = permissionsKeys.active;
		const repeatingItems = this.isRepeat(keys, accounts);
		if (repeatingItems.length) {
			for (let i = 0; i < repeatingItems.length; i += 1) {
				this.props.setKeyError(repeatingItems[i]);
			}
			return;
		}
		let enoughNextThreshold = new BN(0);
		let maxNextValue = new BN(0);
		for (const key in keys) {
			if (!keys[key].key.value) return;
			maxNextValue = maxNextValue.plus(keys[key].weight.value);
			if (keys[key].hasWif && keys[key].hasWif.value) {
				enoughNextThreshold = enoughNextThreshold.plus(keys[key].weight.value);
			}
		}
		for (const account in accounts) {
			if (!accounts[account].key.value) return;
			maxNextValue = maxNextValue.plus(accounts[account].weight.value);
			for (let i = 0; i < accs.length; i += 1) {
				if (accs[i].name === account) {
					enoughNextThreshold =
						enoughNextThreshold.plus(accounts[account].weight.value);
				}
			}
		}
		/*
		const { echoRand } = permissionsKeys;
		for (const key in echoRand.keys) {
			if (!echoRand.keys[key].hasWif.value) {
				this.setState({ echoRandMessage:
					'You removed your EchoRand Key and after
					submitting this action you will lose access to it.',
				});
			}
		}
		*/
		if (maxNextValue.lt(nextTreshold)) {
			this.props.closeModal(MODAL_UNLOCK);
			this.props.setInFormError();
			return;
		} else if (nextTreshold.gt(enoughNextThreshold)) {
			this.setState({
				warningMessage: 'If these changes are applied, you won\'t have enough keys to sign transactions. Do you want to proceed?',
			});
		}
		if (this.state.warningMessage || this.state.echoRandMessage) {
			this.props.openModal(MODAL_CONFIRM_EDITING_OF_PERMISSIONS);
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

		this.props.unlock(password, () => {
			if (this.state.isWifChangingOnly) {
				this.send();
			} else {
				this.props.openModal(MODAL_DETAILS);
			}
		});


	}
	open(modal) {
		this.props.openModal(modal);
	}
	send() {
		const { onUnlock } = this.props;
		const { password, isWifChangingOnly } = this.state;
		if (isWifChangingOnly) {
			onUnlock(password);
			this.props.setValue('isEditMode', false);
			this.props.closeModal(MODAL_DETAILS);
			this.props.resetTransaction();
		} else {
			this.props.sendTransaction(password, () => onUnlock(password));
		}
		this.props.setTableValue('loading', true);
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
			[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]: modalConfirmEditingOfPermissions,
		} = this.props;
		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalConfirmEditingOfPermissions
					show={modalConfirmEditingOfPermissions.get('show')}
					confirm={() => {
						this.open(MODAL_UNLOCK);
						this.props.closeModal(MODAL_CONFIRM_EDITING_OF_PERMISSIONS);
					}}
					close={() => this.close(MODAL_CONFIRM_EDITING_OF_PERMISSIONS)}
					warningMessage={this.state.warningMessage}
					echoRandMessage={this.state.echoRandMessage}
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
	network: PropTypes.object.isRequired,
	showOptions: PropTypes.object,
	[MODAL_UNLOCK]: PropTypes.object.isRequired,
	[MODAL_DETAILS]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
	setInFormError: PropTypes.func.isRequired,
	setKeyError: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setTableValue: PropTypes.func.isRequired,
	treshold: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
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
		form: state.form.get(FORM_PERMISSION_KEY),
		treshold: state.form.getIn([FORM_PERMISSION_KEY, 'active', 'threshold']),
		network: state.global.getIn(['network']),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
		[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]: state.modal.get(MODAL_CONFIRM_EDITING_OF_PERMISSIONS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback)),
		setInFormError: () => dispatch(setInFormError(FORM_PERMISSION_KEY, ['active', 'threshold'], FORM_PERMISSION_TRESHOLD_SUM_ERROR)),
		setKeyError: (item) => dispatch(setInFormError(FORM_PERMISSION_KEY, ['active', item.type, item.index, 'key'], REPEATING_KEYS_ERROR)),
		setValue: (field, value) => dispatch(setValue(FORM_PERMISSION_KEY, field, value)),
		setTableValue: (field, value) => dispatch(setTableValue(PERMISSION_TABLE, field, value)),
		sendTransaction: (keys, callback) => dispatch(sendTransaction(keys, callback)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(WarningConfirmThresholdScenario);

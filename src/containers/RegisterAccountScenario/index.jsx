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
import GlobalReducer from '../../reducers/GlobalReducer';


class RegisterAccountScenario extends React.Component {

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

	async submit() {
		const isValid = await this.props.handleTransaction();

		if (!isValid) {
			return;
		}

		this.props.openModal(MODAL_UNLOCK);
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
			this.props.onUnlock(password);
			this.props.openModal(MODAL_DETAILS);
		});
	}

	open(modal) {
		this.props.openModal(modal);
	}

	send() {
		const { onUnlock } = this.props;
		const { password } = this.state;

		this.props.sendTransaction(password, () => onUnlock(password));
		// this.props.setPermissionLoading(true);
		// this.props.setTableValue('loading', true);
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

RegisterAccountScenario.propTypes = {
	handleTransaction: PropTypes.func.isRequired,
	onUnlock: PropTypes.func,
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
	form: PropTypes.object.isRequired,
};

RegisterAccountScenario.defaultProps = {
	operation: null,
	showOptions: {},
	onUnlock: () => {},
};

export default connect(
	(state) => ({
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		form: state.form.get(FORM_PERMISSION_KEY),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
		[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]: state.modal.get(MODAL_CONFIRM_EDITING_OF_PERMISSIONS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback)),
		sendTransaction: (keys, callback) => dispatch(sendTransaction(keys, callback)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(RegisterAccountScenario);

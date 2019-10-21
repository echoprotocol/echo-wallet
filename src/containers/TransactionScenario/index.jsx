import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';
import Services from '../../services';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';
import { toastError } from '../../helpers/ToastHelper';

class TransactionScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			activeKeysData: [],
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

	async submit(onChangeResetKeys, activeKeysData) {
		const isValid = await this.props.handleTransaction();
		if (!isValid) {
			return;
		}

		this.props.openModal(MODAL_UNLOCK);
		if (activeKeysData) {
			this.setState({ activeKeysData });
		}
		onChangeResetKeys();
		onChangeResetKeys();
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK].get('error')) {
			this.props.clearError(MODAL_UNLOCK);
		}
	}

	async unlock(isCheckTresholdNeed) {
		const { password, activeKeysData } = this.state;
		const nextTreshold = this.props.treshold.value;
		let maxNextTreshold = 0;
		if (isCheckTresholdNeed) {
			const userStorage = Services.getUserStorage();
			const validPublicKeys = await userStorage.getPublicKeysHavesWIFs(activeKeysData.keys, { password });
			console.log(validPublicKeys);
			validPublicKeys.forEach((key) => {
				maxNextTreshold += key.weight;
			});
			if (maxNextTreshold >= nextTreshold) {
				this.props.unlock(password, () => {
					this.props.openModal(MODAL_DETAILS);
				});
			} else {
				toastError('Threshold is too big. You do not have that much private key weight');
				this.props.closeModal(MODAL_UNLOCK);
			}
			this.setState({ activeKeysData: [] });
		} else {
			this.props.unlock(password, () => {
				this.props.openModal(MODAL_DETAILS);
			});
		}
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
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
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

TransactionScenario.propTypes = {
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
};

TransactionScenario.defaultProps = {
	operation: null,
	showOptions: {},
};

export default connect(
	(state) => ({
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		treshold: state.form.getIn([FORM_PERMISSION_KEY, 'active', 'threshold']),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_DETAILS]: state.modal.get(MODAL_DETAILS),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback)),
		sendTransaction: (keys) => dispatch(sendTransaction(keys)),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(TransactionScenario);

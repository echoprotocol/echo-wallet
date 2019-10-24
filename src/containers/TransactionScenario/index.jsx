import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';
import ModalTimer from '../../components/Modals/ModalTimer';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE, MODAL_TIMER } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';

class TransactionScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			currentModal: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}
	static getDerivedStateFromProps(nextProps) {
		if (nextProps.withWarning) {
			return { currentModal: MODAL_TIMER };
		}
		return { currentModal: MODAL_UNLOCK };

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

		this.props.openModal(this.state.currentModal);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK].get('error')) {
			this.props.clearError(MODAL_UNLOCK);
		}
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, () => {
			this.props.openModal(MODAL_DETAILS);
		});
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
		this.props.closeModal(this.state.currentModal);
		this.props.openModal(MODAL_WIPE);
	}

	render() {
		const {
			[MODAL_UNLOCK]: modalUnlock,
			[MODAL_DETAILS]: modalDetails,
			[MODAL_TIMER]: modalTimer,
			withWarning,
		} = this.props;
		let title;
		let warningTextValue;
		let warningTextChackbox;
		let warningTime;
		if (withWarning) {
			title = 'Edit Mode Warning';
			warningTextValue = 'info';
			warningTextChackbox = 'checkbox';
			warningTime = 10;
		}
		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				{
					withWarning ?
						<ModalTimer
							show={modalTimer.get('show')}
							disabled={modalTimer.get('loading')}
							error={modalTimer.get('error')}
							password={this.state.password}
							change={(value) => this.change(value)}
							unlock={() => this.unlock()}
							forgot={() => this.forgot()}
							close={() => this.close(MODAL_TIMER)}
							title={title}
							warningTextValue={warningTextValue}
							warningTextChackbox={warningTextChackbox}
							warningTime={warningTime}
						/> :
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
				}
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
	withWarning: PropTypes.bool,

	operation: PropTypes.string,
	showOptions: PropTypes.object,
	[MODAL_UNLOCK]: PropTypes.object.isRequired,
	[MODAL_DETAILS]: PropTypes.object.isRequired,
	[MODAL_TIMER]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	sendTransaction: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
};

TransactionScenario.defaultProps = {
	operation: null,
	withWarning: false,
	showOptions: {},
};

export default connect(
	(state) => ({
		operation: state.transaction.get('operation'),
		showOptions: state.transaction.get('showOptions'),
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_TIMER]: state.modal.get(MODAL_TIMER),
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

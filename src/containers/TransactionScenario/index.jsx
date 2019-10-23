import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import echo from 'echojs-lib';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalApprove from '../../components/Modals/ModalDetails';

import { MODAL_UNLOCK, MODAL_DETAILS, MODAL_WIPE } from '../../constants/ModalConstants';
import { PERMISSION_TABLE } from '../../constants/TableConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';
import { sendTransaction, resetTransaction } from '../../actions/TransactionActions';
import Services from '../../services';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';
import { toastError } from '../../helpers/ToastHelper';
import { getSigners } from '../../actions/SignActions';


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

	async submit(onFinish) {
		const isValid = await this.props.handleTransaction();
		if (!isValid) {
			return;
		}

		this.props.openModal(MODAL_UNLOCK);
		let { permissionsKeys } = this.props;
		permissionsKeys = permissionsKeys.toJS();
		const activeKeysData = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};
		if (activeKeysData) {
			this.setState({ activeKeysData });
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

	async unlock(isCheckTresholdNeed) {
		const { password, activeKeysData } = this.state;
		const nextTreshold = this.props.treshold.value;
		if (isCheckTresholdNeed) {
			const userStorage = Services.getUserStorage();
			const accountName = this.props.account.toJS().name;
			const account = await echo.api.getAccountByName(accountName);
			const userWIFKeys = await userStorage.getAllWIFKeysForAccount(account.id, { password });
			const accountAuth = account.active.account_auths;
			const accountAuthKeys = [];
			for (let i = 0; i < accountAuth.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				accountAuthKeys.push(await userStorage.getAllWIFKeysForAccount(accountAuth[i][0], { password }));
			}
			console.log(accountAuthKeys.concat(...userWIFKeys));
			console.log(account, userWIFKeys, accountAuthKeys);
			const a = await getSigners(account, accountAuthKeys.concat(...userWIFKeys));
			console.log(a);
			const validPublicKeys =
				await userStorage.getPublicKeysHavesWIFs(activeKeysData.keys, { password });
			const maxNextTreshold = validPublicKeys.reduce((accumulator, currentKey) =>
				accumulator + currentKey.weight, 0);
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
	permissionsKeys: PropTypes.object.isRequired,
	treshold: PropTypes.object.isRequired,
	account: PropTypes.object.isRequired,
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
		permissionsKeys: state.table.get(PERMISSION_TABLE),
		account: state.global.getIn(['activeUser']),
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

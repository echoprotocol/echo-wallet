import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';
import ModalChooseAccount from '../../components/Modals/ModalChooseAccount';

import { MODAL_UNLOCK, MODAL_WIPE, MODAL_CHOOSE_ACCOUNT } from '../../constants/ModalConstants';
import { SORT_ACCOUNTS } from '../../constants/GlobalConstants';
import { openModal, closeModal, setError, update } from '../../actions/ModalActions';
import { unlock, importSelectedAccounts } from '../../actions/AuthActions';
import { toggleSort } from '../../actions/SortActions';

class AuthorizationScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			unlock: false,
			unlockLoading: false,
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	submit() {
		this.setState({ unlock: true });
	}

	change(value) {
		this.setState({ password: value });

		if (this.props[MODAL_UNLOCK].get('error')) {
			this.props.clear(MODAL_UNLOCK);
		}
	}

	unlock() {
		const { password } = this.state;

		this.setState({ unlockLoading: true });
		this.props.unlock(password, this.props.authorize)
			.then(() => this.setState({ unlock: false }))
			.finally(() => this.setState({ unlockLoading: false }));
	}

	close() {
		this.clear();
		this.setState({ unlock: false });
	}

	forgot() {
		this.clear();
		this.setState({ unlock: false });
		this.props.openModal(MODAL_WIPE);
	}

	choose(accounts) {
		const { password } = this.state;

		this.props.importAccounts(password, accounts);
	}

	render() {
		const { password } = this.state;
		const {
			[MODAL_UNLOCK]: modalUnlock,
			[MODAL_CHOOSE_ACCOUNT]: modalChooseAccount,
			sort,
		} = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalUnlock
					show={this.state.unlock}
					disabled={this.state.unlockLoading}
					password={password}
					error={modalUnlock.get('error')}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					forgot={() => this.forgot()}
					close={() => this.close()}
				/>
				<ModalChooseAccount
					show={modalChooseAccount.get('show')}
					accounts={modalChooseAccount.get('accounts')}
					sort={sort}
					closeModal={() => this.close(MODAL_CHOOSE_ACCOUNT)}
					importAccounts={(accounts) => this.choose(accounts)}
					toggleChecked={(param, value) => this.props.toggleChecked(param, value)}
					toggleSort={(type) => this.props.toggleSort(type)}
				/>
			</React.Fragment>
		);
	}

}

AuthorizationScenario.propTypes = {
	children: PropTypes.func.isRequired,
	authorize: PropTypes.func.isRequired,

	[MODAL_UNLOCK]: PropTypes.object.isRequired,
	[MODAL_CHOOSE_ACCOUNT]: PropTypes.object.isRequired,
	sort: PropTypes.object.isRequired,
	unlock: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	toggleChecked: PropTypes.func.isRequired,
	importAccounts: PropTypes.func.isRequired,
	toggleSort: PropTypes.func.isRequired,
};


export default connect(
	(state) => ({
		[MODAL_UNLOCK]: state.modal.get(MODAL_UNLOCK),
		[MODAL_CHOOSE_ACCOUNT]: state.modal.get(MODAL_CHOOSE_ACCOUNT),
		sort: state.sort.get(SORT_ACCOUNTS),
	}),
	(dispatch) => ({
		openModal: (modal) => dispatch(openModal(modal)),
		closeModal: (modal) => dispatch(closeModal(modal)),
		unlock: (value, callback) => dispatch(unlock(value, callback)),
		clear: (modal) => dispatch(setError(modal, null)),
		toggleChecked: (param, value) => dispatch(update(MODAL_CHOOSE_ACCOUNT, param, value)),
		importAccounts: (password, accounts) => dispatch(importSelectedAccounts(password, accounts)),
		toggleSort: (type) => dispatch(toggleSort(SORT_ACCOUNTS, type)),
	}),
)(AuthorizationScenario);

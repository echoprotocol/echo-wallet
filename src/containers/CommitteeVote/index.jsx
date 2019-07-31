import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { FORM_COMMITTEE } from '../../constants/FormConstants';
import {
	setValue,
	setFormValue,
	setFormError,
	deleteValue,
	pushForm,
	clearForm,
} from '../../actions/FormActions';
import {
	formatCommitteeTable,
	formatProxy,
	updateAccount,
	onChangeProxy,
	fetchCommittee,
	checkAccount,
} from '../../actions/CommitteeActions';
import { setValue as setTableValue } from '../../actions/TableActions';

import { COMMITTEE_TABLE } from '../../constants/TableConstants';

import { ECHO_ASSET_ID } from '../../constants/GlobalConstants';
import TransactionScenario from '../TransactionScenario';
import CommitteeTable from './CommitteeTable';

import Loading from '../../components/Loader/LoadingData';


class Voting extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			timeout: null,
		};
	}

	async componentDidMount() {
		await this.props.fetchCommittee();
		this.props.formatCommittee();
		this.props.formatProxy();
	}

	async componentDidUpdate(prevProps) {
		if (_.isEqual(this.props, prevProps)) {
			return;
		}

		const { accounts, isConnect, activeAccount } = this.props;
		const { accounts: prevAccounts, isConnect: prevIsConnect } = prevProps;

		if (isConnect && !prevIsConnect) {
			this.props.fetchCommittee();
		}
		const prevAccount = prevAccounts.getIn([activeAccount, 'options', 'voting_account']);
		const account = accounts.getIn([activeAccount, 'options', 'voting_account']);
		if (account !== prevAccount) {
			this.props.formatProxy();
		}
		if (!_.isEqual(accounts, prevAccounts)) {
			await this.props.formatCommittee();
		}
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.disabledInput();
	}

	async onChange(e) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const value = e.target.value.toLowerCase().trim();

		const field = e.target.name;

		this.props.setFormValue(field, value);
		this.props.setValue('accountLoading', true);
		this.props.setFormError(field, null);
		this.setState({
			timeout: setTimeout(async () => {
				if (!value) {
					this.props.setFormValue(field, value);
					this.props.setValue('accountLoading', false);
					this.props.onChangeProxy(value);
					return;
				}
				if (!(await this.props.checkAccount(value))) {
					this.props.setValue('accountLoading', false);
					this.props.setFormError(field, 'Invalid account name');
				} else {
					this.props.setValue('accountLoading', false);
					this.props.setFormError(field, null);
				}
				this.props.onChangeProxy(value);
			}, 300),
		});


	}

	isSaveable() {
		const {
			votes, canceled,
			account, proxyAccountId,
			votingAccountId,
			accountLoading,
		} = this.props;

		if (
			votes.concat(canceled).size &&
			(account.error === null || !account.error) &&
			!accountLoading
		) {
			return !!votes.concat(canceled).size;
		}

		if (proxyAccountId === votingAccountId) {
			return false;
		}

		return !account.error && !accountLoading;
	}


	renderPage() {
		const {
			committeeTable,
			votes, canceled,
			coreAsset, account,
			accountLoading,
		} = this.props;

		return (
			<div className="voting-wrap">
				<TransactionScenario handleTransaction={() => this.props.updateAccount()}>
					{
						(submit) => (
							<React.Fragment>
								<div className="proxy-wrap">
									<div className="proxy-head">
										<h3>Proxy</h3>
										<div className="top-btn-container">
											<Button
												basic
												content="Save"
												disabled={!this.isSaveable()}
												onClick={submit}
												className={classnames('green', {})}
											/>
										</div>

									</div>
									<div className="description">
										You may delegate your votes to another account.
										That means another account will be able to vote on your behalf.
									</div>
									<Form className="horizontal-input">
										<Form.Field
											className={classnames({
												error: account.error,
												loading: accountLoading,
											})}
										>
											<p className="i-title">Account Name</p>
											<input
												type="text"
												value={account.value}
												onChange={(e) => this.onChange(e, true)}
												disabled={committeeTable && committeeTable.get('disabledInput')}
												name="account"
												className="ui input"
											/>
											{
												account.error &&
												<React.Fragment>
													<span className="icon-error-red value-status" />
													<span className="error-message">{account.error}</span>
												</React.Fragment>
											}
										</Form.Field>
									</Form>
								</div>
								{
									committeeTable &&
									<React.Fragment>
										<CommitteeTable
											committeeTable={committeeTable.get('active')}
											title="Committee Members"
											pushForm={this.props.pushForm}
											deleteValue={this.props.deleteValue}
											votes={votes}
											canceled={canceled}
											coreAsset={coreAsset}
											isVoteLocked={committeeTable.get('locked')}
										/>
										<CommitteeTable
											backup
											committeeTable={committeeTable.get('backup')}
											title="Backup Committee Members"
											pushForm={this.props.pushForm}
											deleteValue={this.props.deleteValue}
											votes={votes}
											canceled={canceled}
											coreAsset={coreAsset}
											isVoteLocked={committeeTable.get('locked')}
										/>
									</React.Fragment>
								}


							</React.Fragment>
						)
					}
				</TransactionScenario>
			</div>
		);
	}

	render() {
		const { loading, isConnect } = this.props;

		return loading && isConnect ? <Loading text="Committee is loading..." /> : this.renderPage();

	}

}

Voting.propTypes = {
	loading: PropTypes.bool,
	accountLoading: PropTypes.bool,
	isConnect: PropTypes.bool,
	account: PropTypes.object.isRequired,
	checkAccount: PropTypes.func.isRequired,
	accounts: PropTypes.object.isRequired,
	committeeTable: PropTypes.any,
	proxyAccountId: PropTypes.any,
	votingAccountId: PropTypes.any,
	votes: PropTypes.object.isRequired,
	canceled: PropTypes.object.isRequired,
	coreAsset: PropTypes.object,
	formatCommittee: PropTypes.func.isRequired,
	updateAccount: PropTypes.func.isRequired,
	fetchCommittee: PropTypes.func.isRequired,
	pushForm: PropTypes.func.isRequired,
	deleteValue: PropTypes.func.isRequired,
	onChangeProxy: PropTypes.func.isRequired,
	formatProxy: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	activeAccount: PropTypes.string,
	clearForm: PropTypes.func.isRequired,
	disabledInput: PropTypes.func.isRequired,
};


Voting.defaultProps = {
	loading: false,
	isConnect: false,
	committeeTable: null,
	coreAsset: null,
	proxyAccountId: null,
	votingAccountId: null,
	accountLoading: false,
	activeAccount: null,
};

export default connect(
	(state) => ({
		account: state.form.getIn([FORM_COMMITTEE, 'account']),
		votingAccountId: state.form.getIn([FORM_COMMITTEE, 'votingAccountId']),
		proxyAccountId: state.form.getIn([FORM_COMMITTEE, 'proxyAccountId']),
		loading: state.form.getIn([FORM_COMMITTEE, 'loading']),
		accountLoading: state.form.getIn([FORM_COMMITTEE, 'accountLoading']),
		accounts: state.echojs.getIn(['data', 'accounts']),
		coreAsset: state.echojs.getIn(['data', 'assets', ECHO_ASSET_ID]),
		committeeTable: state.table.get(COMMITTEE_TABLE),
		votes: state.form.getIn([FORM_COMMITTEE, 'votes']),
		canceled: state.form.getIn([FORM_COMMITTEE, 'canceled']),
		isConnect: state.echojs.getIn(['system', 'isConnected']),
		activeAccount: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		formatCommittee: () => dispatch(formatCommitteeTable()),
		formatProxy: () => dispatch(formatProxy()),
		updateAccount: () => dispatch(updateAccount()),
		fetchCommittee: () => dispatch(fetchCommittee()),
		setValue: (field, value) => dispatch(setValue(FORM_COMMITTEE, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_COMMITTEE, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_COMMITTEE, field, value)),
		checkAccount: (value) => dispatch(checkAccount(value)),
		onChangeProxy: (value) => dispatch(onChangeProxy(value)),
		pushForm: (field, value) => dispatch(pushForm(FORM_COMMITTEE, field, value)),
		deleteValue: (field, value) => dispatch(deleteValue(FORM_COMMITTEE, field, value)),
		clearForm: () => dispatch(clearForm(FORM_COMMITTEE)),
		disabledInput: () => dispatch(setTableValue(COMMITTEE_TABLE, 'disabledInput', true)),
	}),
)(Voting);

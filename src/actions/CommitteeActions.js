/* eslint-disable import/prefer-default-export */
import { List } from 'immutable';
import echo, { CACHE_MAPS } from 'echojs-lib';

import { isCommitteeMemberId } from '../helpers/ValidateHelper';
import { COMMITTEE_TABLE } from '../constants/TableConstants';
import { setValue } from './TableActions';

import { setValue as set, setFormValue, toggleLoading } from './FormActions';
import { ECHO_ASSET_ID, ECHO_PROXY_TO_SELF_ACCOUNT } from '../constants/GlobalConstants';
import { resetTransaction } from './TransactionActions';
import TransactionReducer from '../reducers/TransactionReducer';
import { getOperationFee } from '../api/TransactionApi';
import { validateAccountExist } from '../api/WalletApi';

import { FORM_COMMITTEE } from '../constants/FormConstants';

import { formatError } from '../helpers/FormatHelper';

export const fetchCommittee = () => async (dispatch) => {
	try {
		dispatch(toggleLoading(FORM_COMMITTEE, true));

		let committeesObjects = await echo.api.lookupCommitteeMemberAccounts('');
		committeesObjects = committeesObjects.reduce((arr, obj) => arr.concat(obj[1]), []);

		const requests = committeesObjects.map((committee) => echo.api.getObject(committee));
		await Promise.all(requests);
	} catch (err) {
		dispatch(setValue(FORM_COMMITTEE, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_COMMITTEE, false));
	}
};

export const formatProxy = () => async (dispatch, getState) => {
	const account = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, getState().global.getIn(['activeUser', 'id'])]);
	const votingAccount = account ? account.getIn(['options', 'voting_account']) : '';
	// TODO: check result
	const proxyAccount = await echo.api.getObject(votingAccount);

	if (votingAccount && votingAccount === ECHO_PROXY_TO_SELF_ACCOUNT) {
		dispatch(setFormValue(FORM_COMMITTEE, 'account', ''));
		dispatch(set(FORM_COMMITTEE, 'votingAccountId', votingAccount));
		dispatch(set(FORM_COMMITTEE, 'proxyAccountId', proxyAccount.id));
		dispatch(setValue(COMMITTEE_TABLE, 'locked', false));
		return;
	}

	dispatch(setFormValue(FORM_COMMITTEE, 'account', proxyAccount.name));
	dispatch(set(FORM_COMMITTEE, 'votingAccountId', votingAccount));
	dispatch(set(FORM_COMMITTEE, 'proxyAccountId', proxyAccount.id));
	if (votingAccount === getState().global.getIn(['activeUser', 'id'])) {
		dispatch(setValue(COMMITTEE_TABLE, 'locked', false));
		return;
	}
	dispatch(setValue(COMMITTEE_TABLE, 'locked', true));

};

export const formatCommitteeTable = () => async (dispatch, getState) => {
	const account = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, getState().global.getIn(['activeUser', 'id'])]);
	const accountVotes = account ? account.getIn(['options', 'votes']) : [];

	const stateObjects = getState().echojs.getIn([CACHE_MAPS.OBJECTS_BY_ID]);
	const committeeStateObjects = stateObjects.filter((obj) => isCommitteeMemberId(obj.get('id')));

	const activeCommitteeMembers = (await echo.api.getGlobalProperties()).active_committee_members;

	const activeCommittees = activeCommitteeMembers.map(async (idCommittee) => {
		if (!committeeStateObjects.get(idCommittee)) {
			return null;
		}

		// TODO: check result
		const { name } = (await echo.api.getObject(committeeStateObjects.getIn([idCommittee, 'committee_member_account'])));

		return {
			name,
			votes: committeeStateObjects.getIn([idCommittee, 'total_votes']),
			info: committeeStateObjects.getIn([idCommittee, 'url']),
			voted: accountVotes.includes(committeeStateObjects.getIn([idCommittee, 'vote_id'])),
		};
	});

	dispatch(setValue(COMMITTEE_TABLE, 'active', new List(await Promise.all(activeCommittees))));

	const backupIds = [...committeeStateObjects.keys()]
		.filter((id) => !activeCommitteeMembers.includes(id));
	const backupCommittees = backupIds.map(async (idCommittee) => {

		// TODO: check result
		const { name } = (await echo.api.getObject(committeeStateObjects.getIn([idCommittee, 'committee_member_account'])));

		return {
			name,
			votes: committeeStateObjects.getIn([idCommittee, 'total_votes']),
			info: committeeStateObjects.getIn([idCommittee, 'url']),
			voted: accountVotes.includes(committeeStateObjects.getIn([idCommittee, 'vote_id'])),
		};
	});

	dispatch(setValue(COMMITTEE_TABLE, 'backup', new List(await Promise.all(backupCommittees))));
};

const getVoteIdsByAccountNames = (accountNames) => (dispatch, getState) => {
	const accounts = getState().echojs.getIn([CACHE_MAPS.ACCOUNTS_BY_ID]);
	const objects = getState().echojs.getIn([CACHE_MAPS.OBJECTS_BY_ID]);

	return accountNames.map((name) => {
		const id = accounts.find((account) => account.get('name') === name).get('id');
		return objects.find((object) => object.get('committee_member_account') === id).get('vote_id');
	});
};


export const checkAccount = (account) => async () => {
	const accountNameError = await validateAccountExist(account, false);
	return accountNameError;
};

export const onChangeProxy = (account) => async (dispatch, getState) => {

	if (!account) {
		dispatch(setValue(COMMITTEE_TABLE, 'locked', false));
		dispatch(set(FORM_COMMITTEE, 'votingAccountId', ECHO_PROXY_TO_SELF_ACCOUNT));
		return;
	}

	const accountExist = await dispatch(checkAccount(account));
	dispatch(setValue(COMMITTEE_TABLE, 'locked', true));

	if (accountExist) {

		// TODO: check result
		const votingAccountId = (await echo.api.getObject(account)).id;
		if (getState().global.getIn(['activeUser', 'id']) === votingAccountId) {
			dispatch(setValue(COMMITTEE_TABLE, 'locked', false));
		}
		dispatch(set(FORM_COMMITTEE, 'votingAccountId', votingAccountId));
		return;
	}
	dispatch(set(FORM_COMMITTEE, 'votingAccountId', null));
};

export const updateAccount = () => async (dispatch, getState) => {
	const currentAccount = getState().global.get('activeUser');
	const currentFullAccount = getState().echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, currentAccount.get('id')]);
	const accountOptions = currentFullAccount.get('options');
	const feeAsset = getState().echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, ECHO_ASSET_ID]);

	const votes = getState().form.getIn([FORM_COMMITTEE, 'votes']);
	const canceled = getState().form.getIn([FORM_COMMITTEE, 'canceled']);
	const locked = getState().table.getIn([COMMITTEE_TABLE, 'locked']);
	const voteIds = dispatch(getVoteIdsByAccountNames(votes));
	const canceledIds = dispatch(getVoteIdsByAccountNames(canceled));

	const resultVotes = accountOptions.get('votes').concat(voteIds).filter((vote) => !canceledIds.includes(vote));
	const proxyAccount = getState().form.getIn([FORM_COMMITTEE, 'account']);
	const votingAccountId = getState().form.getIn([FORM_COMMITTEE, 'votingAccountId']);
	const transaction = {
		account: currentAccount.get('id'),
		new_options: {
			num_committee: locked ? accountOptions.get('votes').size : resultVotes.size,
			votes: locked ? accountOptions.get('votes').toArray() : resultVotes.toArray(),
			delegating_account: accountOptions.get('delegating_account'),
			extensions: accountOptions.get('extensions').toArray(),
			memo_key: accountOptions.get('memo_key'),
			voting_account: votingAccountId,
		},
	};

	const showOptions = {
		account: currentAccount.get('name'),
	};

	if (!locked) {
		showOptions.votes = votes;
		showOptions.canceled = canceled;
	}

	if (votingAccountId !== ECHO_PROXY_TO_SELF_ACCOUNT) {
		showOptions.proxy = proxyAccount.value;
	}

	const feeValue = await getOperationFee('account_update', transaction);

	transaction.fee.amount = feeValue;
	transaction.fee.asset_id = '1.3.0';

	showOptions.fee = `${feeValue / (10 ** feeAsset.get('precision'))} ${feeAsset.get('symbol')}`;

	dispatch(resetTransaction());
	dispatch(TransactionReducer.actions.setOperation({
		operation: 'account_update',
		options: transaction,
		showOptions,
	}));
	return true;
};

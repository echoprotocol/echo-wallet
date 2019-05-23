/* eslint-disable import/prefer-default-export */
import { ChainStore, EchoJSActions } from 'echojs-redux';
import { List } from 'immutable';

import { isCommitteeMemberId } from '../helpers/ValidateHelper';
import { COMMITTEE_TABLE } from '../constants/TableConstants';
import { setValue } from './TableActions';
import { ECHO_ASSET_ID, ECHO_PROXY_TO_SELF_ACCOUNT } from '../constants/GlobalConstants';
import { resetTransaction } from './TransactionActions';
import TransactionReducer from '../reducers/TransactionReducer';
import { getOperationFee } from '../api/TransactionApi';
import { FORM_COMMITTEE } from '../constants/FormConstants';
import { toggleLoading } from './FormActions';
import { formatError } from '../helpers/FormatHelper';

export const fetchCommittee = () => async (dispatch) => {
	try {
		dispatch(toggleLoading(FORM_COMMITTEE, true));
		let committeesObjects = await ChainStore.FetchChain('lookupCommitteeMemberAccounts', '');
		committeesObjects = committeesObjects.reduce((arr, obj) => arr.concat(obj[1]), []);
		const requests = committeesObjects.map((committee) => dispatch(EchoJSActions.fetch(committee)));
		await Promise.all(requests);
	} catch (err) {
		dispatch(setValue(FORM_COMMITTEE, 'error', formatError(err)));
	} finally {
		dispatch(toggleLoading(FORM_COMMITTEE, false));
	}
};

export const formatCommitteeTable = () => async (dispatch, getState) => {
	const account = getState().echojs.getIn(['data', 'accounts', getState().global.getIn(['activeUser', 'id'])]);
	const accountVotes = account ? account.getIn(['options', 'votes']) : [];
	const votingAccount = account ? account.getIn(['options', 'voting_account']) : '';

	const stateObjects = getState().echojs.getIn(['data', 'objects']);
	const committeeStateObjects = stateObjects.filter((obj) => isCommitteeMemberId(obj.get('id')));

	const activeCommitteeMembers = (await dispatch(EchoJSActions.fetch('2.0.0'))).get('active_committee_members');

	const activeCommittees = activeCommitteeMembers.map(async (idCommittee) => {
		if (!committeeStateObjects.get(idCommittee)) {
			return null;
		}

		const name = (await dispatch(EchoJSActions.fetch(committeeStateObjects.getIn([idCommittee, 'committee_member_account'])))).get('name');

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
		const name = (await dispatch(EchoJSActions.fetch(committeeStateObjects.getIn([idCommittee, 'committee_member_account'])))).get('name');

		return {
			name,
			votes: committeeStateObjects.getIn([idCommittee, 'total_votes']),
			info: committeeStateObjects.getIn([idCommittee, 'url']),
			voted: accountVotes.includes(committeeStateObjects.getIn([idCommittee, 'vote_id'])),
		};
	});

	dispatch(setValue(COMMITTEE_TABLE, 'backup', new List(await Promise.all(backupCommittees))));

	// TODO proxy on myself
	dispatch(setValue(COMMITTEE_TABLE, 'locked', votingAccount !== ECHO_PROXY_TO_SELF_ACCOUNT));
};

const getVoteIdsByAccountNames = (accountNames) => (dispatch, getState) => {
	const accounts = getState().echojs.getIn(['data', 'accounts']);
	const objects = getState().echojs.getIn(['data', 'objects']);

	return accountNames.map((name) => {
		const id = accounts.find((account) => account.get('name') === name).get('id');
		return objects.find((object) => object.get('committee_member_account') === id).get('vote_id');
	});
};

export const updateAccount = () => async (dispatch, getState) => {
	const currentAccount = getState().global.get('activeUser');
	const currentFullAccount = getState().echojs.getIn(['data', 'accounts', currentAccount.get('id')]);
	const accountOptions = currentFullAccount.get('options');
	const feeAsset = getState().echojs.getIn(['data', 'assets', ECHO_ASSET_ID]);
	const votes = getState().form.getIn([FORM_COMMITTEE, 'votes']);
	const canceled = getState().form.getIn([FORM_COMMITTEE, 'canceled']);

	const voteIds = dispatch(getVoteIdsByAccountNames(votes));
	const canceledIds = dispatch(getVoteIdsByAccountNames(canceled));

	const resultVotes = accountOptions.get('votes').concat(voteIds).filter((vote) => !canceledIds.includes(vote));

	const transaction = {
		account: currentAccount.get('id'),
		new_options: {
			num_committee: resultVotes.size,
			votes: resultVotes.toArray(),
			delegating_account: accountOptions.get('delegating_account'),
			extensions: accountOptions.get('extensions').toArray(),
			memo_key: accountOptions.get('memo_key'),
			voting_account: accountOptions.get('voting_account'),
		},
	};
	const showOptions = {
		account: currentAccount.get('name'),
		votes,
		canceled,
	};

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

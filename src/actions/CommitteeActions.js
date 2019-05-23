/* eslint-disable import/prefer-default-export */
import { ChainStore, EchoJSActions } from 'echojs-redux';
import { List } from 'immutable';

import { isCommitteeMemberId } from '../helpers/ValidateHelper';
import { COMMITTEE_TABLE } from '../constants/TableConstants';
import { setValue } from './TableActions';
import { ECHO_PROXY_TO_SELF_ACCOUNT } from '../constants/GlobalConstants';
import { toggleLoading } from './FormActions';
import { FORM_COMMITTEE } from '../constants/FormConstants';
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

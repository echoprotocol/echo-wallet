import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { formatTotalVotes } from '../../helpers/FormatHelper';
import Avatar from '../../components/Avatar';

export default class CommitteeTable extends React.Component {

	getVoted(accountName, voted) {
		const { votes, canceled } = this.props;

		if (voted) {
			if (canceled.includes(accountName)) {
				return (
					<Button
						basic
						className="main-btn capitalize"
						content="vote"
						onClick={() => this.props.deleteValue('canceled', accountName)}
					/>
				);
			}

			return (
				<div className="voted-wrap">
					<i className="voted icon-voted" />
					<Button
						basic
						className="capitalize"
						content="cancel"
						onClick={() => this.props.pushForm('canceled', accountName)}
					/>
				</div>
			);
		}

		if (votes.includes(accountName)) {
			return (
				<div className="voted-wrap">
					<i className="voted icon-voted" />
					<Button
						basic
						className="capitalize"
						content="cancel"
						onClick={() => this.props.deleteValue('votes', accountName)}
					/>
				</div>
			);
		}

		return (
			<Button
				basic
				className="main-btn capitalize"
				content="vote"
				onClick={() => this.props.pushForm('votes', accountName)}
			/>
		);
	}

	getActiveMembers() {

		const {
			committeeTable, backup, coreAsset, isVoteLocked,
		} = this.props;

		return committeeTable.map((committee, index) => {
			const key = index;

			if (!committee) {
				return null;
			}

			return (
				<Table.Row key={`${backup ? 'backup' : 'active'}${key}`}>
					<Table.Cell >
						<div className="col avatar-block">
							<Avatar accountName={committee.name} />
							<span>{committee.name}</span>
						</div>
					</Table.Cell>
					<Table.Cell>
						{
							coreAsset &&
							formatTotalVotes(committee.votes, coreAsset.get('precision'))
						}
					</Table.Cell>
					<Table.Cell>
						<div className="link">{committee.url}</div>
					</Table.Cell>
					<Table.Cell>
						{

							isVoteLocked ?
								(
									<Button disabled className="btn-lock icon-lock" />
								) :
								(
									this.getVoted(committee.name, committee.voted)
								)
						}
					</Table.Cell>
				</Table.Row>
			);
		}).toArray();
	}

	render() {
		const { committeeTable, title, backup } = this.props;

		if (!committeeTable) {
			return null;
		}

		if (!committeeTable.size) {
			return null;
		}

		return (
			<div className={classnames({ 'main-table-wrap': true, air: backup })}>
				<h3>{title}</h3>
				<Table structured fixed className="main-table">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Votes</Table.HeaderCell>
							<Table.HeaderCell>info</Table.HeaderCell>
							<Table.HeaderCell>
								<span className="th-voting">Voting</span>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.getActiveMembers()}
					</Table.Body>
				</Table>
			</div>
		);
	}

}

CommitteeTable.propTypes = {
	committeeTable: PropTypes.any,
	backup: PropTypes.bool,
	isVoteLocked: PropTypes.bool,
	title: PropTypes.string.isRequired,
	pushForm: PropTypes.func.isRequired,
	deleteValue: PropTypes.func.isRequired,
	votes: PropTypes.object.isRequired,
	canceled: PropTypes.object.isRequired,
	coreAsset: PropTypes.object,
};

CommitteeTable.defaultProps = {
	committeeTable: null,
	backup: false,
	isVoteLocked: false,
	coreAsset: null,
};

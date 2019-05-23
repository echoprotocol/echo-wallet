import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { fetchCommittee, formatCommitteeTable } from '../../actions/CommitteeActions';
import { isCommitteeMemberId } from '../../helpers/ValidateHelper';
import { COMMITTEE_TABLE } from '../../constants/TableConstants';
import CommitteeTable from './CommitteeTable';
import { FORM_COMMITTEE } from '../../constants/FormConstants';
import { deleteValue, pushForm } from '../../actions/FormActions';
import { ECHO_ASSET_ID } from '../../constants/GlobalConstants';
import Loading from '../../components/Loader/LoadingData';


class Voting extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	async componentDidMount() {
		await this.props.fetchCommittee();
		this.props.formatCommittee();
	}

	componentDidUpdate(prevProps) {
		if (_.isEqual(this.props, prevProps)) {
			return;
		}

		const { objects } = this.props;
		const { objects: prevObjects } = prevProps;

		const getCommittee = (objs) => objs.filter((obj) => isCommitteeMemberId(obj.get('id')));

		if (!_.isEqual(getCommittee(objects), getCommittee(prevObjects))) {
			this.props.formatCommittee();
		}
	}

	isSaveable() {
		const { votes, canceled } = this.props;

		return !!votes.concat(canceled).size;
	}

	renderPage() {
		const {
			committeeTable, votes, canceled, coreAsset,
		} = this.props;

		return (
			<div className="voting-wrap">
				<div className="proxy-wrap">
					<div className="proxy-head">
						<h3>Proxy</h3>
						{
							this.isSaveable() &&
							<Button
								basic
								className="green"
								content="Save"
							/>
						}
					</div>
					<div className="description">
                        You may delegate your votes to another account.
                        That means another account will be able to vote on your behalf.
					</div>
					<Form className="horizontal-input">
						<Form.Field
							className={classnames({ error: false })}
						>
							<p className="i-title">Account Name</p>
							<input
								type="text"
								name="account-name"
								className="ui input"
							/>
							{false && <span className="error-message">error-message</span>}
						</Form.Field>
					</Form>
				</div>
				{
					committeeTable &&
						(
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
						)
				}
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
	isConnect: PropTypes.bool,
	objects: PropTypes.object.isRequired,
	committeeTable: PropTypes.any,
	votes: PropTypes.object.isRequired,
	canceled: PropTypes.object.isRequired,
	coreAsset: PropTypes.object,
	formatCommittee: PropTypes.func.isRequired,
	fetchCommittee: PropTypes.func.isRequired,
	pushForm: PropTypes.func.isRequired,
	deleteValue: PropTypes.func.isRequired,
};

Voting.defaultProps = {
	loading: false,
	isConnect: false,
	committeeTable: null,
	coreAsset: null,
};

export default connect(
	(state) => ({
		objects: state.echojs.getIn(['data', 'objects']),
		coreAsset: state.echojs.getIn(['data', 'assets', ECHO_ASSET_ID]),
		committeeTable: state.table.get(COMMITTEE_TABLE),
		votes: state.form.getIn([FORM_COMMITTEE, 'votes']),
		canceled: state.form.getIn([FORM_COMMITTEE, 'canceled']),
		loading: state.form.getIn([FORM_COMMITTEE, 'loading']),
		isConnect: state.echojs.getIn(['system', 'isConnected']),
	}),
	(dispatch) => ({
		formatCommittee: () => dispatch(formatCommitteeTable()),
		fetchCommittee: () => dispatch(fetchCommittee()),
		pushForm: (field, value) => dispatch(pushForm(FORM_COMMITTEE, field, value)),
		deleteValue: (field, value) => dispatch(deleteValue(FORM_COMMITTEE, field, value)),
	}),
)(Voting);

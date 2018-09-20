import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Loading from '../../components/Loader/LoadingData';

import { formatHistory, viewTransaction } from '../../actions/HistoryActions';
import { clearTable } from '../../actions/TableActions';

import { HISTORY_TABLE } from '../../constants/TableConstants';

import RowComponent from './RowComponent';

class Activity extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			history: [],
		};
	}

	static getDerivedStateFromProps(props, state) {
		const history = props.account ? props.account.toJS().history : [];
		return _.isEqual(state.history, history) ? null : { history };
	}

	componentDidMount() {
		this.format(this.state.history);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevState.history, this.state.history)) {
			this.format(this.state.history);
		}
	}

	componentWillUnmount() {
		this.props.clearTable();
	}

	format(data) {
		setTimeout(() => this.props.formatHistory(data), 1 * 1000);
	}

	renderEmpty() {
		return (
			<div className="msg-empty">
				<h3>You have no actions</h3>
			</div>
		);
	}

	renderTable() {
		const { history } = this.props;

		return history ? (
			<Table className="table-activity">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Operation</Table.HeaderCell>
						<Table.HeaderCell>Block</Table.HeaderCell>
						<Table.HeaderCell>From</Table.HeaderCell>
						<Table.HeaderCell>Subject</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
						<Table.HeaderCell>Fee</Table.HeaderCell>
						<Table.HeaderCell>Time</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{
						history.map((i) => (
							<RowComponent
								key={i.id}
								data={i}
								viewTransaction={this.props.viewTransaction}
							/>
						))
					}
				</Table.Body>
			</Table>
		) : this.renderEmpty();
	}

	render() {
		const { loading } = this.props;

		return loading ? <Loading text="Load history..." /> : this.renderTable();
	}

}

Activity.propTypes = {
	history: PropTypes.any,
	loading: PropTypes.bool.isRequired,
	formatHistory: PropTypes.func.isRequired,
	viewTransaction: PropTypes.func.isRequired,
	clearTable: PropTypes.func.isRequired,
};

Activity.defaultProps = {
	history: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		const account = state.echojs.getIn(['data', 'accounts', accountId]);
		const history = state.table.getIn([HISTORY_TABLE, 'data']);
		const loading = state.table.getIn([HISTORY_TABLE, 'loading']);
		return { account, history, loading };
	},
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
		viewTransaction: (value) => dispatch(viewTransaction(value)),
		clearTable: () => dispatch(clearTable(HISTORY_TABLE)),
	}),
)(Activity);

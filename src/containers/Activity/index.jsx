import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../../components/Loading';

import { formatHistory, viewTransaction } from '../../actions/HistoryActions';
import { setLoading } from '../../actions/TableActions';

import { HISTORY_DATA } from '../../constants/TableConstants';

import RowComponent from './RowComponent';

class Activity extends React.Component {


	componentWillMount() {
		this.props.setLoading(true);
	}

	componentDidMount() {
		const account = this.props.account ? this.props.account.toJS() : null;

		if (account && account.history) {
			setImmediate(() => this.props.formatHistory(account.history));
		}
		process.nextTick(() => this.props.setLoading(false));
	}

	componentDidUpdate(prevProps) {
		const account = this.props.account ? this.props.account.toJS() : null;
		const oldAccount = prevProps.account ? prevProps.account.toJS() : null;

		if (!account || !account.history) {
			return;
		}

		if (!oldAccount || !oldAccount.history) {
			this.props.formatHistory(account.history);
			return;
		}

		if (oldAccount.history[0].id !== account.history[0].id) {
			this.props.formatHistory(account.history);
		}
	}

	renderTable() {
		const { history } = this.props;

		return (
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
		);
	}

	render() {
		const { history, loading } = this.props;
		return !history || loading ? <Loading /> : this.renderTable();
	}

}

Activity.propTypes = {
	history: PropTypes.any,
	account: PropTypes.any,
	formatHistory: PropTypes.func.isRequired,
	viewTransaction: PropTypes.func.isRequired,
	setLoading: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

Activity.defaultProps = {
	account: null,
	history: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		const account = state.echojs.getIn(['data', 'accounts', accountId]);
		const history = state.table.getIn([HISTORY_DATA, 'history']);
		const loading = state.table.getIn([HISTORY_DATA, 'loading']);

		return { account, history, loading };
	},
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
		viewTransaction: (value) => dispatch(viewTransaction(value)),
		setLoading: (value) => dispatch(setLoading(HISTORY_DATA, value)),
	}),
)(Activity);

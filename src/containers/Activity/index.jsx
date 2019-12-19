import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { scroller } from 'react-scroll';
import { CACHE_MAPS } from 'echojs-lib';
import { FormattedMessage, injectIntl } from 'react-intl';

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
		if (!prevProps.isConnect && this.props.isConnect) {
			this.format(this.state.history);
		}
		if (!_.isEqual(prevState.history, this.state.history)) {
			this.format(this.state.history);
		}
		const { loading, activeTransaction } = this.props;
		if (!loading && activeTransaction) {
			scroller.scrollTo(`tx_${this.props.activeTransaction}`, {
				duration: 500,
				delay: 100,
				smooth: true,
				offset: -116,
				containerId: 'activityContainer',
			});
		}
	}

	componentWillUnmount() {
		this.props.clearTable();
	}

	format(data) {
		setTimeout(() => this.props.formatHistory(data), 1 * 1000);
	}

	renderEmpty(isConnect) {
		const { intl } = this.props;
		return (
			<div className="msg-empty">
				<h3>
					{
						isConnect ?
							intl.formatMessage({ id: 'recent_activity_page.no_actions' }) :
							intl.formatMessage({ id: 'recent_activity_page.load_actions' })
					}

				</h3>
			</div>
		);
	}

	renderTable() {
		const { history } = this.props;

		return history ? (
			<Table className="table-activity">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.operation" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.block" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.from" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.subject" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.value" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.fee" /></Table.HeaderCell>
						<Table.HeaderCell><FormattedMessage id="recent_activity_page.table.headers.time" /></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body id="activityContainer">
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
		const { loading, isConnect, intl } = this.props;

		return loading && isConnect ?
			<Loading text={intl.formatMessage({ id: 'recent_activity_page.loader_title' })} /> :
			this.renderTable(isConnect);
	}

}

Activity.propTypes = {
	history: PropTypes.any,
	loading: PropTypes.bool.isRequired,
	isConnect: PropTypes.any,
	intl: PropTypes.any.isRequired,
	activeTransaction: PropTypes.string.isRequired,
	formatHistory: PropTypes.func.isRequired,
	viewTransaction: PropTypes.func.isRequired,
	clearTable: PropTypes.func.isRequired,
};

Activity.defaultProps = {
	history: null,
	isConnect: false,
};

export default injectIntl(connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		const account = state.echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, accountId]);
		const history = state.table.getIn([HISTORY_TABLE, 'data']);
		const loading = state.table.getIn([HISTORY_TABLE, 'loading']);
		const activeTransaction = state.table.getIn([HISTORY_TABLE, 'activeTransaction']);
		const isConnect = state.global.get('isConnected');
		return {
			account, history, loading, activeTransaction, isConnect,
		};
	},
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
		viewTransaction: (value) => dispatch(viewTransaction(value)),
		clearTable: () => dispatch(clearTable(HISTORY_TABLE)),
	}),
)(Activity));

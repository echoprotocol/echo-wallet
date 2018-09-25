import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Element, Events, animateScroll as scroll, scroller } from 'react-scroll';
import classnames from 'classnames';
import moment from 'moment';

import Loading from '../../components/Loader/LoadingData';

import { formatHistory, viewTransaction } from '../../actions/HistoryActions';
import { clearTable } from '../../actions/TableActions';

import { HISTORY_TABLE } from '../../constants/TableConstants';

import RowComponent from './RowComponent';
import { formatAmount } from '../../helpers/FormatHelper';

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
		if (this.refEnd) {
			// this.refEnd.scrollIntoView({ behavior: 'smooth' });
		}
		if (this.props.activeTransaction) {
			scroller.scrollTo(`tx_${this.props.activeTransaction}`, {
				duration: 1500,
				delay: 100,
				smooth: true,
				offset: -100,
				containerId: 'activityContainer',
			});
		}
	}

	// componentWillUnmount() {
	// 	this.props.clearTable();
	// }

	onTransaction(e, data) {
		this.props.viewTransaction(data);
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
			<React.Fragment>
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
					<Table.Body id="activityContainer">
						{/* { */}
						{/* history.map((i) => ( */}
						{/* <RowComponent */}
						{/* key={i.id} */}
						{/* data={i} */}
						{/* viewTransaction={this.props.viewTransaction} */}
						{/* /> */}
						{/* )) */}
						{/* } */}
						{
							history.map((i) => {

								const amount = i.value.amount
									? formatAmount(i.value.amount, i.value.precision)
									: null;
								const symbol = i.value.amount ? i.value.symbol : null;

								const feeAmount = i.fee.amount ? formatAmount(i.fee.amount, i.fee.precision) : null;
								const feeSymbol = i.fee.amount ? i.fee.symbol : null;

								return (
									<Table.Row
										key={i.id}
										className="pointer"
										role="button"
										onClick={(e) => this.onTransaction(e, i)}
									>
										<Table.Cell>
											<Element
												key={i.id}
												id={`tx_${i.id}`}
												name={`tx_${i.id}`}
											/>
											<span className={classnames('label-operation', i.color)}>{i.name}</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">#{i.block}</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">{i.from}</span>
										</Table.Cell>
										<Table.Cell>
											{/* TODO add to contract create operation className=create */}
											<span className="ellips">
												{i.subject}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
												<span className="text-bold">{amount}</span>
												<span>{symbol}</span>
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
												<span className="text-bold">{feeAmount}</span>
												<span>{feeSymbol}</span>
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="date">{moment.utc(i.timestamp).local().format('MMMM D, YYYY')}</span>
											<span className="time">{moment.utc(i.timestamp).local().format('h:mm:ss A')}</span>
										</Table.Cell>
									</Table.Row>
								);
							})
						}
					</Table.Body>
				</Table>

			</React.Fragment>
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
	activeTransaction: PropTypes.string.isRequired,
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
		const activeTransaction = state.table.getIn([HISTORY_TABLE, 'activeTransaction']);
		return {
			account, history, loading, activeTransaction,
		};
	},
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
		viewTransaction: (value) => dispatch(viewTransaction(value)),
		clearTable: () => dispatch(clearTable(HISTORY_TABLE)),
	}),
)(Activity);

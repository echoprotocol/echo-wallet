import React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatHistory } from '../../actions/TableActions';

import { formatAmount } from '../../helpers/OperationsHistoryHelper';
import HISTORY_DATA from '../../constants/TableConstants';

class TableComponent extends React.Component {

	shouldComponentUpdate(nextProps) {
		const { history: currentHistory } = this.props;
		const { history: nextHistory } = nextProps;
		if (currentHistory !== nextHistory) {
			this.props.formatHistory(nextProps.history);
			return true;
		}
		return false;
	}

	renderLoading() {
		return (
			<Dimmer inverted active>
				<Loader inverted content="" />
			</Dimmer>
		);
	}

	renderTable() {
		return (
			<Table striped className="table-activity">
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
						this.props.tableHistory ?
							this.props.tableHistory.map((h, i) => {
								const id = i;
								return (
									<Table.Row key={id}>
										<Table.Cell>
											{/*
										 label-operation can be yellow (Place order)
										 / red (Cancel order) / green (Transfer)
										 */}
											<span className={h.operationColor}>
												{h.operation}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
                                            #{h.block}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
												{h.from}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
												{h.subject}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="ellips">
												{
													h.value.amount
														? formatAmount(h.value.amount, h.value.precision, h.value.symbol)
														: h.value.amount
												}
											</span>
										</Table.Cell>
										<Table.Cell>
											{
												h.fee.amount
													? formatAmount(h.fee.amount, h.fee.precision, h.fee.symbol)
													: h.fee.amount
											}
										</Table.Cell>
										<Table.Cell>
											<span className="date">{h.timestamp.date}</span>
											<span className="time">{h.timestamp.time}</span>
										</Table.Cell>
									</Table.Row>
								);
							})
							:
							this.renderLoading()
					}
				</Table.Body>
			</Table>
		);
	}

	render() {
		return (
			<div className="content center-mode ">
				{
					this.props.tableHistory ?
						this.renderTable() :
						this.renderLoading()
				}
			</div>
		);
	}

}

TableComponent.propTypes = {
	history: PropTypes.any,
	tableHistory: PropTypes.any,
	formatHistory: PropTypes.func.isRequired,
};

TableComponent.defaultProps = {
	history: null,
	tableHistory: null,
};


export default connect(
	(state) => ({
		history: state.echojs.getIn(['userData', 'account', 'history']),
		tableHistory: state.table.getIn([HISTORY_DATA, 'history']),
	}),
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
	}),
)(TableComponent);

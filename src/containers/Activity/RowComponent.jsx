import React from 'react';
import { Table } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import formatAmount from '../../helpers/HistoryHelper';

class RowComponent extends React.Component {

	render() {
		const { rowData, id } = this.props;
		return (
			<Table.Row key={id}>
				<Table.Cell>
					<span className={rowData.operationColor}>
						{rowData.operation}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						#{rowData.block}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						{rowData.from}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className={rowData.isCreateContract ? 'ellips create' : 'ellips'}>
						{rowData.subject}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						{
							rowData.value.amount
								? formatAmount(rowData.value.amount, rowData.value.precision, rowData.value.symbol)
								: rowData.value.amount
						}
					</span>
				</Table.Cell>
				<Table.Cell>
					{
						rowData.fee.amount
							? formatAmount(rowData.fee.amount, rowData.fee.precision, rowData.fee.symbol)
							: rowData.fee.amount
					}
				</Table.Cell>
				<Table.Cell>
					<span className="date">{rowData.timestamp.date}</span>
					<span className="time">{rowData.timestamp.time}</span>
				</Table.Cell>
			</Table.Row>
		);
	}

}

RowComponent.propTypes = {
	id: PropTypes.number.isRequired,
	rowData: PropTypes.object.isRequired,
};


export default connect()(RowComponent);

import React from 'react';
import { Table } from 'semantic-ui-react';

import PropTypes from 'prop-types';

import formatAmount from '../../helpers/HistoryHelper';

class RowComponent extends React.Component {

	render() {
		const {
			operationColor,
			operation,
			block,
			from,
			subject,
			value,
			fee,
			timestamp,
		} = this.props.data;

		const amount = value.amount ? formatAmount(value.amount, value.precision, value.symbol) : null;
		const feeAmount = fee.amount ? formatAmount(fee.amount, fee.precision, fee.symbol) : null;

		return (
			<Table.Row>
				<Table.Cell>
					<span className={operationColor}>{operation}</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">#{block}</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">{from}</span>
				</Table.Cell>
				<Table.Cell>
					{/* TODO add to contract create operation className=create */}
					<span className="ellips">
						{subject}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">{amount}</span>
				</Table.Cell>
				<Table.Cell>
					{feeAmount}
				</Table.Cell>
				<Table.Cell>
					<span className="date">{timestamp.date}</span>
					<span className="time">{timestamp.time}</span>
				</Table.Cell>
			</Table.Row>
		);
	}

}

RowComponent.propTypes = {
	data: PropTypes.object.isRequired,
};


export default RowComponent;

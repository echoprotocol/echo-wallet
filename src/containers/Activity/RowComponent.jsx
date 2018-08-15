import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { formatAmount } from '../../helpers/FormatHelper';

class RowComponent extends React.Component {

	onTransaction() {
		this.props.viewTransaction(this.props.data);
	}

	render() {
		const {
			color,
			name,
			block,
			from,
			subject,
			value,
			fee,
			timestamp,
		} = this.props.data;

		const amount = value.amount ? formatAmount(value.amount, value.precision) : null;
		const symbol = value.amount ? value.symbol : null;

		const feeAmount = fee.amount ? formatAmount(fee.amount, fee.precision) : null;
		const feeSymbol = fee.amount ? fee.symbol : null;

		return (
			<Table.Row
				className="pointer"
				role="button"
				onClick={(e) => this.onTransaction(e)}
			>
				<Table.Cell>
					<span className={classnames('label-operation', color)}>{name}</span>
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
					<span className="ellips">{symbol}</span>
				</Table.Cell>
				<Table.Cell>
					<span>{feeAmount}</span>
					<span>{feeSymbol}</span>
				</Table.Cell>
				<Table.Cell>
					<span className="date">{moment.utc(timestamp).local().format('MMMM D, YYYY')}</span>
					<span className="time">{moment.utc(timestamp).local().format('h:mm:ss A')}</span>
				</Table.Cell>
			</Table.Row>
		);
	}

}

RowComponent.propTypes = {
	data: PropTypes.object.isRequired,
	viewTransaction: PropTypes.func.isRequired,
};


export default RowComponent;

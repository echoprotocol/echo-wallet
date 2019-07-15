import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll/modules/index';

import { formatAmount } from '../../helpers/FormatHelper';

import Avatar from '../../components/Avatar';

class RowComponent extends React.Component {

	onTransaction() {
		this.props.viewTransaction(this.props.data);
	}

	render() {
		const {
			id,
			color,
			name,
			block,
			from,
			subject,
			value,
			fee,
			timestamp,
		} = this.props.data;

		const amount = value.amount && value.precision ?
			formatAmount(value.amount, value.precision) : value.amount;
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
					<Element
						key={id}
						id={`tx_${id}`}
						name={`tx_${id}`}
					/>
					<span className={classnames('label-operation', color)}>{name}</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">#{block}</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips avatar-block">
						<Avatar accountName={from} />
						<span>{from}</span>
					</span>
				</Table.Cell>
				<Table.Cell>
					{/* TODO add to contract create operation className=create */}
					<span className="ellips avatar-block">
						<Avatar accountName={subject} />
						<span>{subject}</span>
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
					<span className="date">{moment.utc(timestamp).local().format('MMM D, YYYY')}</span>
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

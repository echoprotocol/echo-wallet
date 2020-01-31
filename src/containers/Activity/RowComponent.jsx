import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll/modules/index';

import { formatAmount } from '../../helpers/FormatHelper';

import Avatar from '../../components/Avatar';
import { ACCOUNT_ID_PREFIX } from '../../constants/GlobalConstants';

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

		const isFromAccount = from && from.id.toString().startsWith(ACCOUNT_ID_PREFIX);
		const isSubjectAccount = subject && subject.id && subject.id.startsWith(ACCOUNT_ID_PREFIX);

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
					{
						from ? (
							<span className={classnames('ellips', { 'avatar-block': isFromAccount })}>
								{isFromAccount && <Avatar accountName={from.value} />}
								<span>{from.value}</span>
							</span>
						) : null
					}
				</Table.Cell>
				<Table.Cell>
					{/* TODO add to contract create operation className=create */}
					{
						subject ? (
							<span className={classnames('ellips', { 'avatar-block': isSubjectAccount })}>
								{isSubjectAccount && <Avatar accountName={subject.value} />}
								<span>{subject.value}</span>
							</span>
						) : null
					}
				</Table.Cell>
				<Table.Cell>
					{
						value.amount ? (
							<span className="ellips">
								<span className="text-bold">
									{value.amount && value.precision ?
										formatAmount(value.amount, value.precision) : value.amount}
								</span>
								<span>{Number.isInteger(Number(value.amount)) && value.symbol}</span>
							</span>
						) : null
					}
				</Table.Cell>
				<Table.Cell>
					{
						fee ? (
							<span className="ellips">
								{
									typeof fee.amount === 'number' &&
									<React.Fragment>
										<span className="text-bold">{formatAmount(fee.amount, fee.precision)}</span>
										<span>{fee.symbol}</span>
									</React.Fragment>
								}
							</span>
						) : null
					}
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

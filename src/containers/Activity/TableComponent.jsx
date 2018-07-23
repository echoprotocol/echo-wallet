import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatHistory } from '../../actions/TableActions';

import HISTORY_DATA from '../../constants/TableConstants';

import Loading from '../../components/Loading';
import RowComponent from './RowComponent';

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
						this.props.tableHistory.map((h, i) => {
							const id = i;
							return (
								<RowComponent key={id} id={id} rowData={h} />
							);
						})
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
						<Loading />
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

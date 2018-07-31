import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatHistory } from '../../actions/TableActions';

import HISTORY_DATA from '../../constants/TableConstants';

import Loading from '../../components/Loading';
import RowComponent from './RowComponent';

class Activity extends React.Component {

	shouldComponentUpdate(nextProps) {
		const { history: currentHistory } = this.props;
		const { history: nextHistory } = nextProps;

		const { tableHistory: nextTableHistory } = this.props;
		const { tableHistory: currentTableHistory } = nextProps;
		if (currentHistory !== nextHistory) {
			this.props.formatHistory(nextProps.history);
			return true;
		} else if (currentTableHistory !== nextTableHistory) {
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
			<div className="content">
				{
					this.props.tableHistory ?
						this.renderTable() :
						<Loading />
				}
			</div>
		);
	}

}

Activity.propTypes = {
	history: PropTypes.any,
	tableHistory: PropTypes.any,
	formatHistory: PropTypes.func.isRequired,
};

Activity.defaultProps = {
	history: null,
	tableHistory: null,
};

export default connect(
	(state) => ({
		history: state.echojs.getIn(['data', 'accounts', state.global.getIn(['activeUser', 'id']), 'history']),
		accounts: state.echojs.getIn(['data', 'accounts']),
		tableHistory: state.table.getIn([HISTORY_DATA, 'history']),
	}),
	(dispatch) => ({
		formatHistory: (value) => dispatch(formatHistory(value)),
	}),
)(Activity);

import React from 'react';
import { Table } from 'semantic-ui-react';

import { connect } from 'react-redux';


class Assets extends React.Component {


	render() {
		return (
			<div className="table-assets">
				<Table className="thead" unstackable>
					<Table.Body>
						<Table.Row>
							<Table.Cell>Block ID</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
				<Table className="tbody" unstackable>
					<Table.Body>
						<Table.Row>
							<Table.Cell>Block ID</Table.Cell>
							<Table.Cell>Date</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}

}


export default connect()(Assets);


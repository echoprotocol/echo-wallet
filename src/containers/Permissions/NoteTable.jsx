import React from 'react';
import { Table } from 'semantic-ui-react';

class NoteTable extends React.Component {

	render() {
		return (

			<div className="permissions-table-wrap">
				<h3>Note Key</h3>
				<Table structured className="permissions-table">

					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Account / Key </Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>

							<Table.Cell>
                                    keVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8BTS5EXBBsHfr8c3yWVp
							</Table.Cell>
						</Table.Row>


						<Table.Row>
							<Table.Cell>
                                    keVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8BTS5EXBBsHfr8c3yWVp
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}

}


export default NoteTable;

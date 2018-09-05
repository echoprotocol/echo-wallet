import React from 'react';
import { Table } from 'semantic-ui-react';

class OwnerTable extends React.Component {

	render() {
		return (

			<div className="permissions-table-wrap">
				<h3>Owner Permissions</h3>
				<Table structured className="permissions-table">

					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Account / Key </Table.HeaderCell>
							<Table.HeaderCell> Private Key </Table.HeaderCell>

						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>

							<Table.Cell>
                                    keVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8BTS5EXBBsHfr8c3yWVp
							</Table.Cell>
							<Table.Cell className="key-hide">
								<div className="cell-wrap">
									<button className="icon icon-hide" />
									<span className="key">BTS5EXBBsHfr8c3yWVpkeVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8</span>
								</div>
							</Table.Cell>
						</Table.Row>


						<Table.Row>
							<Table.Cell>
                                    keVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8BTS5EXBBsHfr8c3yWVp
							</Table.Cell>
							<Table.Cell className="key-show">
								<div className="cell-wrap">
									<button className="icon icon-show" />
									<input
										className="key-input"
										type="password"
										readOnly
										value="BTS5EXBBsHfr8c3yWVpkeVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q8"
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}

}


export default OwnerTable;

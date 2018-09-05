import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

class PermissionTable extends React.Component {

	render() {

		const { table, data } = this.props;
		return (

			<div className="permissions-table-wrap">
				<h3>{`${table} Permissions`}</h3>
				<Table structured className="permissions-table">

					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Account / Key </Table.HeaderCell>
							<Table.HeaderCell> Private Key </Table.HeaderCell>

						</Table.Row>
					</Table.Header>

					<Table.Body>
						{
							data.map((k) => {
								const key = k[0];
								// key-show
								return (
									<Table.Row key={key}>
										<Table.Cell>
											{key}
										</Table.Cell>
										<Table.Cell className="key-hide">
											<div className="cell-wrap">
												<button className="icon icon-hide" />
												<span className="key">{key}</span>
											</div>
										</Table.Cell>
									</Table.Row>
								);
							})
						}
					</Table.Body>
				</Table>
			</div>
		);
	}

}

PermissionTable.propTypes = {
	table: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
};

export default PermissionTable;

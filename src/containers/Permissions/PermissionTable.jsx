import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import classnames from 'classnames';

class PermissionTable extends React.Component {

	onClick() {

	}

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
								const { key } = k;
								return (
									<Table.Row key={key}>
										<Table.Cell>
											{key}
										</Table.Cell>
										<Table.Cell className={classnames({ 'key-hide': !k.unlocked, 'key-show': k.unlocked })} >
											<div className="cell-wrap">
												<button
													className={classnames('icon', { 'icon-hide': !k.unlocked, 'icon-show': k.unlocked })}
													onClick={() => this.onClick(k)}
												/>
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

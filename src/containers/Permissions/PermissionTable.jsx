import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';
import classnames from 'classnames';


class PermissionTable extends React.Component {

	renderPrivateKeyCell(publicKey, key) {
		return (
			<Table.Cell className={key ? 'key-hide' : 'key-show'} >
				<div className="cell-wrap">
					<Button
						className={classnames('icon', key ? 'icon-show' : 'icon-hide')}
						onClick={() => this.props.submit(this.props.table.toLowerCase(), publicKey)}
					/>
					{
						key ?
							<span className="key">{key.privateKey}</span> :
							<input
								tabIndex="-1"
								type="password"
								readOnly
								className="key-input"
								value="0000000000000000000000000000000000000000000000000000000000000000"
							/>
					}
				</div>
			</Table.Cell>
		);

	}

	render() {
		const { table, data, keys } = this.props;

		return (

			<div className="permissions-table-wrap">
				<h3>{`${table} Permissions`}</h3>
				<Table structured fixed className="permissions-table">

					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Account / Key </Table.HeaderCell>
							<Table.HeaderCell> Private Key </Table.HeaderCell>

						</Table.Row>
					</Table.Header>

					<Table.Body>
						{
							data.map(({ key }) => (
								<Table.Row key={`${table}_${key}`}>
									<Table.Cell>{key}</Table.Cell>
									{this.renderPrivateKeyCell(key, keys.find((k) => k.publicKey === key))}
								</Table.Row>
							))
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
	keys: PropTypes.array.isRequired,
	submit: PropTypes.func.isRequired,
};


export default PermissionTable;

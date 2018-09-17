import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { unlockPrivateKey } from '../../actions/TableActions';

class PermissionTable extends React.Component {

	onClick(k) {
		this.props.unlockPrivateKey(k);
	}

	renderPrivateKeyCell(k) {
		return (
			<Table.Cell className={classnames({ 'key-hide': !k.unlocked, 'key-show': k.unlocked })} >
				<div className="cell-wrap">
					<Button
						className={classnames('icon', { 'icon-hide': !k.unlocked, 'icon-show': k.unlocked })}
						onClick={() => this.onClick(k)}
					/>
					{
						k.unlocked ?
							<span className="key">{k.privateKey}</span> :
							<input tabIndex="-1" type="password" readOnly className="key-input" value={k.privateKey} />

					}

				</div>
			</Table.Cell>
		);

	}

	render() {

		const { table, data } = this.props;
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
							data.map((k) => (
								<Table.Row key={k.key}>
									<Table.Cell>{k.key}</Table.Cell>
									{
										this.renderPrivateKeyCell(k)
									}
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
	unlockPrivateKey: PropTypes.func.isRequired,
};


export default connect(
	() => ({}),
	(dispatch) => ({
		unlockPrivateKey: (value) => dispatch(unlockPrivateKey(value)),
	}),
)(PermissionTable);

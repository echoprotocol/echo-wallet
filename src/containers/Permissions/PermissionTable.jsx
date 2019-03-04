import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { unlockPrivateKey } from '../../actions/TableActions';

import PermissionTableRow from './PermissionTableRow';

class PermissionTable extends React.Component {


	render() {

		const {
			table, description, data, noInput, noBtn,
		} = this.props;

		return (

			<div className="permissions-table-wrap">
				<h3>{`${table}`}</h3>
				<p className="description">{description}</p>
				{
					(!noInput) && (
						<Form className="treshhold-input">
							<Form.Field>
								<p className="i-title">TRESHHOLD</p>
								<input
									type="text"
									placeholder="Enter threshold"
									name="name"
									className="ui input"
									// value={name.value}
									onChange={(e) => this.onInput(e)}
									autoFocus
								/>
								{/* <span className="error-message">{name.error}</span> */}
							</Form.Field>
						</Form>
					)
				}
				<Table structured fixed className="permissions-table">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Account / Key</Table.HeaderCell>
							<Table.HeaderCell>Private Key</Table.HeaderCell>
							<Table.HeaderCell>Weight</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<PermissionTableRow data={data} />
						<PermissionTableRow data={data} />
					</Table.Body>
				</Table>
				{
					(!noBtn) && (
						<div className="btn-container">
							<Button
								basic
								className="main-btn"
								content="ADD KEY"
							/>
						</div>
					)
				}
			</div>
		);
	}

}

PermissionTable.propTypes = {
	table: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	noInput: PropTypes.bool,
	noBtn: PropTypes.bool,
	description: PropTypes.string,
};

PermissionTable.defaultProps = {
	noInput: false,
	noBtn: false,
	description: null,
};


export default connect(
	() => ({}),
	(dispatch) => ({
		unlockPrivateKey: (value) => dispatch(unlockPrivateKey(value)),
	}),
)(PermissionTable);

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';

import PermissionTableRow from './PermissionTableRow';
import ThresholdRow from './ThresholdRow';


class PermissionTable extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			addKeys: [],
		};
	}

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.resetAddKeys) {
			return { addKeys: [] };
		} else if (nextProps.error) {
			return { addKeys: [] };
		}
		return null;
	}

	onAddKey(num) {
		const { addKeys } = this.state;

		if (num) {
			addKeys.push(num);
		} else {
			addKeys.push(addKeys.length ? addKeys[addKeys.length - 1] + 1 : 0);
		}

		this.setState({ addKeys });
	}

	onCancelAddKey(num) {
		const { addKeys } = this.state;

		addKeys.splice(addKeys.indexOf(num), 1);

		this.setState({ addKeys });
	}

	render() {
		const {
			table, description, data, noInput, noBtn, keyRole, keys,
		} = this.props;
		const { addKeys } = this.state;
		return (

			<div className="main-table-wrap">
				<h3>{`${table}`}</h3>
				<p className="description">{description}</p>
				{
					(!noInput) && <ThresholdRow keyRole={keyRole} defaultThreshold={data.threshold} />
				}
				<Table structured fixed className="main-table">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Account / Key</Table.HeaderCell>
							<Table.HeaderCell>Private Key</Table.HeaderCell>
							<Table.HeaderCell>Weight</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<PermissionTableRow
							data={data.keys}
							addKeys={addKeys}
							cancelEdit={(num) => this.onCancelAddKey(num)}
							keyRole={keyRole}
							privateKeys={keys}
							submit={this.props.submit}
							resetAddKeys={this.props.resetAddKeys}
							onAddKey={(num) => this.onAddKey(num)}
						/>
					</Table.Body>
				</Table>
				{
					(!noBtn) && (
						<div className="btn-container">
							<Button
								basic
								className="main-btn"
								content="ADD KEY"
								onClick={() => this.onAddKey()}
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
	data: PropTypes.object.isRequired,
	noInput: PropTypes.bool,
	noBtn: PropTypes.bool,
	resetAddKeys: PropTypes.bool.isRequired,
	description: PropTypes.string,
	keyRole: PropTypes.string.isRequired,
	keys: PropTypes.array.isRequired,
	submit: PropTypes.func.isRequired,
	error: PropTypes.string,
};

PermissionTable.defaultProps = {
	noInput: false,
	noBtn: false,
	description: null,
	error: null,
};


export default PermissionTable;

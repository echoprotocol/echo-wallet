import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from '../../history';

import {
	CREATE_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
} from '../../constants/RouterConstants';

class SmartContracts extends React.Component {

	onLink(link) {
		history.push(link);
	}

	renderRow([name, { id }]) {
		return (
			<Table.Row key={id}>
				<Table.Cell>
					<span className="ellips">
						{id}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						{name}
					</span>
				</Table.Cell>
			</Table.Row>
		);
	}

	renderList() {
		const contracts = this.props.contracts.toJS();

		return (
			<React.Fragment>
				<Table striped className="table-smart-contract">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Contract ID</Table.HeaderCell>
							<Table.HeaderCell>
                                Watched Contract Name
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{ Object.entries(contracts).map((i) => this.renderRow(i)) }
					</Table.Body>
				</Table>
				<div className="btn-list" >
					<Link to={ADD_CONTRACT_PATH}>
						<Button content="watch contract" color="grey" />
					</Link>
					<Button content="create new contract" color="orange" onClick={(e) => this.onLink(CREATE_CONTRACT_PATH, e)} />
				</div>
			</React.Fragment>
		);
	}

	renderEmpty() {
		return (
			<div className="empty-contracts">
				<h3>Start watch contract or create a new one</h3>
				<div className="btns">
					<Link to={ADD_CONTRACT_PATH}>
						<Button content="watch contract" color="grey" />
					</Link>
					<Button content="create new contract" color="orange" onClick={(e) => this.onLink(CREATE_CONTRACT_PATH, e)} />
				</div>
			</div>
		);
	}

	render() {
		const { contracts } = this.props;
		return contracts && contracts.size ? this.renderList() : this.renderEmpty();
	}

}

SmartContracts.propTypes = {
	contracts: PropTypes.any,
};

SmartContracts.defaultProps = {
	contracts: null,
};

export default connect((state) => ({
	contracts: state.global.get('contracts'),
}))(SmartContracts);

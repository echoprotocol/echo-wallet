import React from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from '../../history';

import {
	CREATE_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	VIEW_CONTRACT_PATH,
} from '../../constants/RouterConstants';

class ContractList extends React.Component {

	constructor() {
		super();
		this.state = {
			sortType: 'id',
			sortInc: true,
		};
	}

	onSort(sortType) {
		const sortInc = sortType === this.state.sortType ? !this.state.sortInc : true;
		this.setState({ sortType, sortInc });
	}

	onLink(link) {
		history.push(link);
	}

	sortList() {
		const contracts = this.props.contracts.toJS();
		const { sortType, sortInc } = this.state;

		return Object.entries(contracts)
			.sort(([name1, { id: id1 }], [name2, { id: id2 }]) => {

				const t1 = (sortType === 'id' ? id1.split('1.16.')[1] : name1) || '';
				const t2 = (sortType === 'id' ? id2.split('1.16.')[1] : name2) || '';
				return (t1.localeCompare(t2, [], { numeric: true })) * (sortInc ? 1 : -1);
			});
	}

	renderRow([name, { id, disabled }]) {
		if (disabled) {
			return null;
		}

		return (
			<Table.Row
				className="pointer"
				key={id}
				role="button"
				onClick={(e) => this.onLink(VIEW_CONTRACT_PATH.replace(/:name/, name), e)}
			>
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
		return (
			<React.Fragment>
				<Table striped className="table-smart-contract">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell onClick={() => this.onSort('id')}>
								<span>
                                    Contract ID
									<Icon name="sort" size="tiny" />
								</span>

							</Table.HeaderCell>
							<Table.HeaderCell onClick={() => this.onSort('name')}>
								<span>
                                    Watched Contract Name
									<Icon name="sort" size="tiny" />
								</span>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{
							this.sortList().map((i) => this.renderRow(i))
						}
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

		if (!contracts) {
			return this.renderEmpty();
		}

		const activeContracts = Object.values(contracts.toJS()).filter((i) => !i.disabled);

		return activeContracts.length ? this.renderList() : this.renderEmpty();
	}

}

ContractList.propTypes = {
	contracts: PropTypes.any,
};

ContractList.defaultProps = {
	contracts: null,
};

export default connect((state) => ({
	contracts: state.global.get('contracts'),
}))(ContractList);

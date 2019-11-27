import React from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import history from '../../history';

import {
	ADD_CONTRACT_PATH,
	VIEW_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
} from '../../constants/RouterConstants';
import { CONTRACT_ID_PREFIX, SORT_CONTRACTS } from '../../constants/GlobalConstants';

import { toggleSort } from '../../actions/SortActions';

class ContractList extends React.Component {

	onSort(sortType) {
		this.props.toggleSort(sortType);
	}

	onLink(link) {
		history.push(link);
	}

	sortList() {
		const contracts = this.props.contracts.toJS();
		const { sortType, sortInc } = this.props.sort.toJS();

		return Object.entries(contracts)
			.sort(([name1, { id: id1 }], [name2, { id: id2 }]) => {

				const t1 = (sortType === 'id' ? id1.split(`${CONTRACT_ID_PREFIX}.`)[1] : name1) || '';
				const t2 = (sortType === 'id' ? id2.split(`${CONTRACT_ID_PREFIX}.`)[1] : name2) || '';
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
		const { sortType, sortInc } = this.props.sort.toJS();
		return (
			<React.Fragment>
				<Table striped className="table-smart-contract">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell onClick={() => this.onSort('id')}>
								<span className="sort-wrap">
                                    Contract ID
									<div className="sort">
										<Icon
											name="dropdown"
											flipped="vertically"
											className={classnames({ active: sortType === 'id' && sortInc })}
										/>
										<Icon
											name="dropdown"
											flipped="horizontally"
											className={classnames({ active: sortType === 'id' && !sortInc })}
										/>
									</div>
								</span>
							</Table.HeaderCell>
							<Table.HeaderCell onClick={() => this.onSort('name')}>
								<span className="sort-wrap">
                                    Watched Contract Name
									<div className="sort">
										<Icon
											name="dropdown"
											flipped="vertically"
											className={classnames({ active: sortType === 'name' && sortInc })}
										/>
										<Icon
											name="dropdown"
											flipped="horizontally"
											className={classnames({ active: sortType === 'name' && !sortInc })}
										/>
									</div>
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
					<Button
						className="main-btn"
						content="watch contract"
						onClick={(e) => this.onLink(ADD_CONTRACT_PATH, e)}
					/>
					<Button
						content="create new contract"
						className="main-btn"
						onClick={(e) => this.onLink(SMART_CONTRACTS_PATH, e)}
					/>
					<Button
						content="call contract"
						className="main-btn"
						onClick={(e) => this.onLink(CALL_CONTRACT_PATH, e)}
					/>
				</div>
			</React.Fragment>
		);
	}

	renderEmpty() {
		return (
			<div className="empty-contracts">
				<div className="contract-navigator">
					<h3>Start watch contract or create a new one</h3>
					<div className="btns">
						<Button
							content="watch contract"
							className="main-btn"
							basic
							onClick={(e) => this.onLink(ADD_CONTRACT_PATH, e)}
						/>
						<Button
							content="create new contract"
							className="main-btn"
							basic
							onClick={(e) => this.onLink(SMART_CONTRACTS_PATH, e)}
						/>
						<Button
							content="call contract"
							className="main-btn"
							basic
							onClick={(e) => this.onLink(CALL_CONTRACT_PATH, e)}
						/>
					</div>
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
	toggleSort: PropTypes.func.isRequired,
	sort: PropTypes.object.isRequired,
};

ContractList.defaultProps = {
	contracts: null,
};

export default connect(
	(state) => ({
		contracts: state.global.get('contracts'),
		sort: state.sort.get(SORT_CONTRACTS),
	}),
	(dispatch) => ({
		toggleSort: (type) => dispatch(toggleSort(SORT_CONTRACTS, type)),
	}),
)(ContractList);

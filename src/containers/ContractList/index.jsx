import React from 'react';
import { Table, Button } from 'semantic-ui-react';
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
import { CONTRACT_ID_PREFIX, SORT_CONTRACTS, ECHO_ASSET_ID } from '../../constants/GlobalConstants';

import { toggleSort } from '../../actions/SortActions';

class ContractList extends React.Component {

	onSort(sortType) {
		this.props.toggleSort(sortType);
	}

	onLink(link) {
		history.push(link);
	}

	showBalance(balance) {
		if (balance.length === 1) {
			return balance[0];
		}

		const coreAsset = balance.find(({ amount, id: assetId }) => amount !== '0' && assetId === ECHO_ASSET_ID);

		if (!coreAsset) {
			const anotherNotNullBalance = balance.find(({ amount, id: assetId }) => amount !== '0' && assetId !== ECHO_ASSET_ID);

			return anotherNotNullBalance || balance[0];
		}

		return coreAsset;
	}

	sortList() {
		const contracts = this.props.contracts.toJS();
		const { sortType, sortInc } = this.props.sort.toJS();

		return Object.entries(contracts)
			.sort(([id1, data1], [id2, data2]) => {

				const balanceToShow1 = this.showBalance(data1.balance);
				const balanceToShow2 = this.showBalance(data2.balance);

				let t1 = '';
				let t2 = '';

				switch (sortType) {
					case 'id':
						t1 = id1.split(`${CONTRACT_ID_PREFIX}.`)[1] || '';
						t2 = id2.split(`${CONTRACT_ID_PREFIX}.`)[1] || '';
						break;
					case 'name':
						t1 = data1.name || '';
						t2 = data2.name || '';
						break;
					case 'balance':
						t1 = balanceToShow1.amount || '';
						t2 = balanceToShow2.amount || '';
						break;
					default:
				}

				return (t1.localeCompare(t2, [], { numeric: true })) * (sortInc ? 1 : -1);
			});
	}

	renderRow([id, { name, disabled, balance }]) {
		if (disabled) {
			return null;
		}

		const balanceToShow = this.showBalance(balance);

		return (
			<Table.Row
				className="pointer"
				key={id}
				role="button"
				onClick={(e) => this.onLink(VIEW_CONTRACT_PATH.replace(/:id/, id), e)}
			>
				<Table.Cell>
					{id}
				</Table.Cell>
				<Table.Cell >
					<div className="name">{name}</div>
				</Table.Cell>
				<Table.Cell>
					<div className="balance-wrap">
						<span className="balance">{balanceToShow.amount}</span>
						<span className="coin">{balanceToShow.symbol}</span>
					</div>
				</Table.Cell>
			</Table.Row>
		);
	}

	renderSort(sortType, sortInc, type) {
		return (
			<div className="sort">
				<i className={classnames('icon-sort-up', { active: sortType === type && sortInc })} />
				<i className={classnames('icon-sort-down', { active: sortType === type && !sortInc })} />
			</div>
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
								<div className="sort-wrap">
									Contract ID
									{this.renderSort(sortType, sortInc, 'id')}
								</div>
							</Table.HeaderCell>
							<Table.HeaderCell onClick={() => this.onSort('name')}>
								<div className="sort-wrap" >
									Watched Contract Name
									{this.renderSort(sortType, sortInc, 'name')}
								</div>
							</Table.HeaderCell>
							<Table.HeaderCell onClick={() => this.onSort('balance')}>
								<div className="sort-wrap">
									Contract Balance
									{this.renderSort(sortType, sortInc, 'balance')}
								</div>
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

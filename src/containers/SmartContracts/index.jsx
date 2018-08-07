import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from '../../history';

import { getContractId } from '../../helpers/FormatHelper';

// import { MODAL_WATCH_LIST } from '../../constants/ModalConstants';
import { CREATE_CONTRACT_PATH, TO_WATCH_LIST_PATH } from '../../constants/RouterConstants';


import { openModal } from '../../actions/ModalActions';

class SmartContracts extends React.Component {

	onModal(modal) {
		this.props.openModal(modal);
	}

	onLink(link) {
		history.push(link);
	}

	renderRow([address], key) {
		return (
			<Table.Row key={key}>
				<Table.Cell>
					<span className="ellips">
						{` 1.16.${getContractId(address)} `}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						{` ${address} `}
					</span>
				</Table.Cell>
			</Table.Row>
		);
	}

	renderNormal(contracts) {
		return (
			<React.Fragment>
				<Table striped className="table-smart-contract">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Contract ID</Table.HeaderCell>
							<Table.HeaderCell>
                                Watched Contract Address
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{
							contracts.size ?
								Object.entries(contracts.toJS())
									.map((contract, i) => this.renderRow(contract, i)) :
								<Table.Row className="msg-empty">
									<Table.Cell>There is no contracts yet...</Table.Cell>
								</Table.Row>
						}
					</Table.Body>
				</Table>
				<div className="btn-list" >
					<Link to={TO_WATCH_LIST_PATH}>
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
					<Link to={TO_WATCH_LIST_PATH}>
						<Button content="watch contract" color="grey" />
					</Link>
					<Button content="create new contract" color="orange" onClick={(e) => this.onLink(CREATE_CONTRACT_PATH, e)} />
				</div>
			</div>
		);
	}

	render() {
		const { contracts } = this.props;
		return contracts && contracts.size ? this.renderNormal(contracts) : this.renderEmpty();
	}

}

SmartContracts.propTypes = {
	contracts: PropTypes.any,
	openModal: PropTypes.func.isRequired,
};

SmartContracts.defaultProps = {
	contracts: null,
};

export default connect(
	(state) => ({
		contracts: state.global.get('contracts'),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
	}),
)(SmartContracts);

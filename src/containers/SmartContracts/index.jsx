import React from 'react';
import { Table, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from '../../history';

import { getContractId } from '../../helpers/FormatHelper';

import { MODAL_WATCH_LIST } from '../../constants/ModalConstants';
import { CREATE_CONTRACT_PATH } from '../../constants/RouterConstants';

import { openModal } from '../../actions/ModalActions';
import { loadContracts } from '../../actions/ContractActions';

class SmartContracts extends React.Component {

	constructor() {
		super();
		this.state = { visibleBar: false };
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.sidebarHide = this.sidebarHide.bind(this);
	}

	componentWillMount() {
		this.props.loadContracts();
	}

	onModal(modal) {
		this.props.openModal(modal);
	}

	onLink(link) {
		history.push(link);
	}

	toggleSidebar() {
		this.setState({ visibleBar: !this.state.visibleBar });
	}

	sidebarHide() {
		if (this.state.visibleBar) {
			this.setState({ visibleBar: false });
		}
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

	render() {
		const { contracts } = this.props;

		return (
			<div>
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
					<Button content="watch contract" color="grey" onClick={(e) => this.onModal(MODAL_WATCH_LIST, e)} />
					<Button content="create new contract" color="orange" onClick={(e) => this.onLink(CREATE_CONTRACT_PATH, e)} />
				</div>
			</div>
		);
	}

}

SmartContracts.propTypes = {
	contracts: PropTypes.any,
	openModal: PropTypes.func.isRequired,
	loadContracts: PropTypes.func.isRequired,
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
		loadContracts: () => dispatch(loadContracts()),
	}),
)(SmartContracts);

import React from 'react';
import { Table, Segment, Sidebar, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

import { MODAL_WATCH_LIST } from '../../constants/ModalConstants';
import { CREATE_CONTRACT_PATH } from '../../constants/RouterConstants';

import { openModal } from '../../actions/ModalActions';

class SmartContracts extends React.Component {

	constructor() {
		super();
		this.state = { visibleBar: false };
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.sidebarHide = this.sidebarHide.bind(this);
	}

	onModal(modal) {
		this.props.openModal(modal);
	}

	toggleSidebar() {
		this.setState({ visibleBar: !this.state.visibleBar });
	}

	sidebarHide() {
		if (this.state.visibleBar) {
			this.setState({ visibleBar: false });
		}
	}

	renderRow([address, abi], key) {
		return (
			<Table.Row key={key}>
				<Table.Cell>
					<span className="ellips">
						{' '}
						1.16.124{' '}
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="ellips">
						{' '}
						0x78e43503bb1474c32718d0x78e43503{' '}
					</span>
				</Table.Cell>
			</Table.Row>
		);
	}

	renderTable() {
		const { contracts } = this.props;

		return (
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
					{Array(10)
						.fill()
						.map((a, i) => {
							const id = i;
							return (
								<Table.Row key={id}>
									<Table.Cell>
										<span className="ellips">
											{' '}
                                            1.16.124{' '}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span className="ellips">
											{' '}
                                            0x78e43503bb1474c32718d0x78e43503{' '}
										</span>
									</Table.Cell>
								</Table.Row>
							);
						})}
				</Table.Body>
			</Table>
		);
	}

	render() {
		const { contracts } = this.props;

		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu
					visibleBar={this.state.visibleBar}
					onToggleSidebar={this.toggleSidebar}
				/>
				<Sidebar.Pusher
					onClick={this.sidebarHide}
					dimmed={this.state.visibleBar}
				>
					<Segment basic className="wrapper">
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content">
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
											contracts ?
												Object.entries(contracts).map((contract, i) => this.renderRow(contract, i)) :
												<Table.Row className="msg-empty">
													<Table.Cell>There is no contracts yet...</Table.Cell>
												</Table.Row>
										}
									</Table.Body>
								</Table>
							</div>
						</div>
						<div className="btn-list" >
							<Button content="watch contract" color="grey" onClick={(e) => this.onModal(MODAL_WATCH_LIST, e)} />
							<Button content="create new contract" color="orange" onClick={(e) => this.onLink(CREATE_CONTRACT_PATH, e)} />
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
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

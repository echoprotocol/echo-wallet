import React from 'react';
import { Table, Segment, Sidebar, Dimmer, Loader, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

class SmartContracts extends React.Component {

	constructor() {
		super();
		this.state = { visibleBar: false };
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.sidebarHide = this.sidebarHide.bind(this);
	}

	toggleSidebar() {
		this.setState({ visibleBar: !this.state.visibleBar });
	}

	sidebarHide() {
		if (this.state.visibleBar) {
			this.setState({ visibleBar: false });
		}
	}

	renderTable() {
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

	renderLoading() {
		return (
			<Dimmer inverted active>
				<Loader inverted content="" />
			</Dimmer>
		);
	}

	render() {
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
						<div className="content center-mode ">
							{!this.props.history ? (
								this.renderLoading()
							) : (
								<div>{this.renderTable()}</div>
							)}
						</div>
						<div className="btn-list" >
							<Button content="watch contract" color="gray" />
							<Button content="create new contract" color="orange" />
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

SmartContracts.propTypes = {
	history: PropTypes.any,
};

SmartContracts.defaultProps = {
	history: null,
};

export default connect((state) => ({
	history: state.echojs.getIn(['userData', 'account', 'history']),
}))(SmartContracts);

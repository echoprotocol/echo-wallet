import React from 'react';
import { Segment, Sidebar, Dimmer, Loader, Tab } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TabContractProps from './TabContractProps';
import TabCallContracts from './TabCallContracts';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

class ViewContracts extends React.Component {

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

	renderLoading() {
		return (
			<Dimmer inverted active>
				<Loader inverted content="" />
			</Dimmer>
		);
	}

	render() {
		const panes = [
			{
				menuItem: 'View properties',
				render: () => (
					<Tab.Pane>
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'call contracts',
				render: () => (
					<Tab.Pane>
						<TabCallContracts />
					</Tab.Pane>
				),
			},
		];
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
								<Tab menu={{ tabular: true }} className="tub-full" panes={panes} />
							</div>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

export default connect()(ViewContracts);

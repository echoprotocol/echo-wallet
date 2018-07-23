import React from 'react';
import { Segment, Sidebar, Dimmer, Loader, Tab } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TabContractProps from '../../components/Tabs/TabContractProps';
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
				menuItem: 'Ставки сотрудников',
				render: () => (
					<Tab.Pane>
						<TabContractProps />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'Затраты компании',
				render: () => (
					<Tab.Pane>
						<TabContractProps />
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
							{!this.props.history ? (
								this.renderLoading()
							) : (
								<div>
									<Tab menu={{ color: 'orange', tabular: true }} className="tub-full" panes={panes} />
								</div>
							)}
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

ViewContracts.propTypes = {
	history: PropTypes.any,
};

ViewContracts.defaultProps = {
	history: null,
};

export default connect((state) => ({
	history: state.echojs.getIn(['userData', 'account', 'history']),
}))(ViewContracts);

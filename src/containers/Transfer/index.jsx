import React from 'react';
import { Form, Segment, Sidebar } from 'semantic-ui-react';

import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import SidebarMenu from '../../components/SideMenu/index';
import FormComponent from './FormComponent';

class Transfer extends React.Component {

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
	render() {

		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu visibleBar={this.state.visibleBar} onToggleSidebar={this.toggleSidebar} />
				<Sidebar.Pusher onClick={this.sidebarHide} dimmed={this.state.visibleBar}>
					<Segment basic className="wrapper">
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content center-mode ">
							<Form className="main-form">
								<FormComponent />
							</Form>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

export default Transfer;

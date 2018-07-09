import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment, Sidebar } from 'semantic-ui-react';
import SidebarMenu from './layout/SidebarMenu';
import Header from './layout/Header';
import Footer from './layout/Footer';

import ModalConfirm from './modals/Confirm';

class App extends React.Component {

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

	renderModals() {
		return (
			<div>
				<ModalConfirm />
			</div>
		);
	}

	render() {
		const { children, headerVisibility } = this.props;
		return (
			<div className="global-wrapper">

				<Sidebar.Pushable as={Segment}>
					<SidebarMenu visibleBar={this.state.visibleBar} onToggleSidebar={this.toggleSidebar} />
					<Sidebar.Pusher onClick={this.sidebarHide} dimmed={this.state.visibleBar}>
						<Segment basic className="wrapper">
							{headerVisibility ? <Header onToggleSidebar={this.toggleSidebar} /> : <div /> }
							{/* .center-mode needs only for signIn / signUp / createWallet pages */}
							<div className="content center-mode ">
								{children}
							</div>
							<Footer />
						</Segment>
					</Sidebar.Pusher>
				</Sidebar.Pushable>

				{this.renderModals()}
			</div>
		);
	}

}

App.propTypes = {
	children: PropTypes.element.isRequired,
	headerVisibility: PropTypes.bool.isRequired,
};

export default connect((state) => ({
	globalLoading: state.global.get('globalLoading'),
	loading: state.global.get('loading'),
	headerVisibility: state.global.get('headerVisibility'),
}))(App);

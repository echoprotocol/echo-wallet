import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import SidebarMenu from '../../components/SideMenu/index';
import FormComponent from './FormComponent';
import { hideBar } from '../../actions/GlobalActions';

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
				<SidebarMenu />
				<Sidebar.Pusher
					dimmed={this.props.visibleBar}
					onClick={() => this.props.hideBar()}
				>
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

Transfer.propTypes = {
	visibleBar: PropTypes.bool.isRequired,
	hideBar: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		visibleBar: state.global.get('visibleBar'),
	}),
	(dispatch) => ({
		hideBar: () => dispatch(hideBar()),
	}),
)(Transfer);

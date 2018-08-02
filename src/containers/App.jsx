import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment, Sidebar } from 'semantic-ui-react';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import { connection, hideBar } from '../actions/GlobalActions';

import Modals from '../components/Modals';
import Loading from '../components/Loading/index';
import SidebarMenu from '../components/SideMenu/index';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';

import { AUTH_ROUTES, CENTER_MODE_ROUTES } from '../constants/RouterConstants';

class App extends React.Component {

	componentDidMount() {
		this.props.connection();
	}

	renderWrapper() {
		const { globalLoading, children, location } = this.props;

		return (
			<Segment basic className="wrapper">
				{ !AUTH_ROUTES.includes(location.pathname) ? <Header /> : null }
				<div className={classnames('content', { 'center-mode': CENTER_MODE_ROUTES.includes(location.pathname) })}>
					{ globalLoading ? <Loading /> : children }
				</div>
				<Footer />
			</Segment>
		);
	}

	render() {
		const { location } = this.props;

		return (
			<div className="global-wrapper">
				<Segment>
					<Sidebar.Pushable as={Segment}>
						{
							!AUTH_ROUTES.includes(location.pathname) ?
								[
									<SidebarMenu key="sidebar" />,
									<Sidebar.Pusher
										key="sidebar-pusher"
										dimmed={this.props.visibleBar}
										onClick={() => this.props.hideBar()}
									>
										{ this.renderWrapper() }
									</Sidebar.Pusher>,
								] : this.renderWrapper()
						}
					</Sidebar.Pushable>
				</Segment>

				<Modals />
			</div>
		);
	}

}

App.propTypes = {
	location: PropTypes.object.isRequired,
	globalLoading: PropTypes.bool.isRequired,
	children: PropTypes.element.isRequired,
	visibleBar: PropTypes.bool.isRequired,
	connection: PropTypes.func.isRequired,
	hideBar: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		loading: state.global.get('loading'),
		visibleBar: state.global.get('visibleBar'),
	}),
	(dispatch) => ({
		connection: () => dispatch(connection()),
		hideBar: () => dispatch(hideBar()),
	}),
)(App));

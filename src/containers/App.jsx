import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment, Sidebar } from 'semantic-ui-react';
import classnames from 'classnames';
import { withRouter } from 'react-router';

import { connection, toggleBar, historyMove } from '../actions/GlobalActions';

import Modals from '../components/Modals';
import Loading from '../components/Loading/index';
import SidebarMenu from '../components/SideMenu/index';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';
import Toast from '../components/Toast';

import { PUBLIC_ROUTES, CENTER_MODE_ROUTES } from '../constants/RouterConstants';

class App extends React.Component {

	componentWillMount() {
		this.props.historyPush(this.props.location.pathname);
	}

	componentDidMount() {
		this.props.connection();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.props.historyPush(nextProps.location.pathname);
		}
	}

	onPusher() {
		if (!this.props.visibleBar) { return; }

		this.props.hideBar();
	}

	renderWrapper() {
		const { children, location } = this.props;

		return (
			<Segment basic className="wrapper">
				{ !PUBLIC_ROUTES.includes(location.pathname) ? <Header /> : null }
				<div className={classnames('content', { 'center-mode': CENTER_MODE_ROUTES.includes(location.pathname) })}>
					{children}
				</div>
				<Footer />
			</Segment>
		);
	}

	renderSidebar() {
		const { location } = this.props;
		return (
			<Sidebar.Pushable as={Segment}>
				{
					!PUBLIC_ROUTES.includes(location.pathname) ?
						[
							<SidebarMenu key="sidebar" />,
							<Sidebar.Pusher
								key="sidebar-pusher"
								dimmed={this.props.visibleBar}
								onClick={() => this.onPusher()}
							>
								{ this.renderWrapper() }
							</Sidebar.Pusher>,
						] : this.renderWrapper()
				}
			</Sidebar.Pushable>
		);
	}

	render() {
		const { globalLoading } = this.props;

		return (
			<div className="global-wrapper">
				<Segment>
					{globalLoading ? <Loading /> : this.renderSidebar()}
				</Segment>

				<Modals />
				<Toast />

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
	historyPush: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		visibleBar: state.global.get('visibleBar'),
	}),
	(dispatch) => ({
		connection: () => dispatch(connection()),
		hideBar: () => dispatch(toggleBar(true)),
		historyPush: (path) => dispatch(historyMove(path)),
	}),
)(App));

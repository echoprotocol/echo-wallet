import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment, Sidebar } from 'semantic-ui-react';
import classnames from 'classnames';
import { withRouter, matchPath } from 'react-router';

import { connection, toggleBar } from '../actions/GlobalActions';

import Modals from '../components/Modals';
import Loading from '../components/Loading/index';
import SidebarMenu from '../components/SideMenu/index';
import Header from '../components/Header/index';
import GlobalHeader from '../components/GlobalHeader';

import Footer from '../components/Footer/index';
import Toast from '../components/Toast';

import {
	PUBLIC_ROUTES,
	CENTER_MODE_ROUTES,
	VIEW_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
} from '../constants/RouterConstants';

class App extends React.Component {

	componentDidMount() {
		this.props.connection();
	}

	componentWillReceiveProps(nextProps) {
		const { location, accountId, networkName } = this.props;
		const {
			accountId: nextAccountId,
			networkName: nextNetworkName,
		} = nextProps;

		const isInnerPath = [
			VIEW_TRANSACTION_PATH,
			VIEW_CONTRACT_PATH,
		].find((path) => matchPath(
			location.pathname,
			{ path, exact: true, strict: false },
		));

		if (isInnerPath && (nextAccountId !== accountId || nextNetworkName !== networkName)) {
			this.props.history.goBack();
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
			<React.Fragment>
				<GlobalHeader />
				{ ELECTRON ? <GlobalHeader /> : null }


				<div className="global-wrapper">
					<Segment>
						{globalLoading ? <Loading /> : this.renderSidebar()}
					</Segment>

					<Modals />
					<Toast />

				</div>
			</React.Fragment>
		);
	}

}

App.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	globalLoading: PropTypes.bool.isRequired,
	accountId: PropTypes.string.isRequired,
	networkName: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
	visibleBar: PropTypes.bool.isRequired,
	connection: PropTypes.func.isRequired,
	hideBar: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		visibleBar: state.global.get('visibleBar'),
		accountId: state.global.getIn(['activeUser', 'id']),
		networkName: state.global.getIn(['network', 'name']),
	}),
	(dispatch) => ({
		connection: () => dispatch(connection()),
		hideBar: () => dispatch(toggleBar(true)),
	}),
)(App));

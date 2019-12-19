import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Sidebar } from 'semantic-ui-react';
import { withRouter, matchPath } from 'react-router';
import { IntlProvider } from 'react-intl';

import { toggleBar } from '../actions/GlobalActions';

import Modals from '../components/Modals';
import Loading from '../components/Loading/index';
import SidebarMenu from '../components/SideMenu/index';
import Header from '../components/Header/index';
import GlobalHeader from '../components/GlobalHeader';
import en from '../translations/en.json';

import Footer from '../components/Footer/index';
import Toast from '../components/Toast';

import {
	PUBLIC_ROUTES,
	VIEW_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
} from '../constants/RouterConstants';
import TranslateHelper from '../helpers/TranslateHelper';

class App extends React.Component {

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
			<div className="wrapper">
				{!PUBLIC_ROUTES.includes(location.pathname) && <Header />}
				<div className="content">
					{children}
				</div>
				<Footer />
			</div>
		);
	}

	renderSidebar() {
		const { location } = this.props;
		return (
			<Sidebar.Pushable>
				{
					!PUBLIC_ROUTES.includes(location.pathname) ?
						[
							<SidebarMenu key="sidebar" />,
							<Sidebar.Pusher
								key="sidebar-pusher"
								dimmed={this.props.visibleBar}
								onClick={() => this.onPusher()}
							>
								{this.renderWrapper()}
							</Sidebar.Pusher>,
						] : this.renderWrapper()
				}
			</Sidebar.Pushable>
		);
	}

	renderLoading() {
		const { disconnected, inited } = this.props;

		return (
			<div className="loader-container">
				<Loading disconnected={inited && disconnected} />
				{inited && disconnected ? <Footer /> : null}
			</div>
		);
	}

	render() {
		const { globalLoading, language } = this.props;
		const messages = { en };

		const flatten = TranslateHelper.flattenMessages(messages[language]);
		return (
			<IntlProvider locale={language} messages={flatten}>
				<React.Fragment>
					{ELECTRON ? <GlobalHeader /> : null}


					<div className="global-wrapper">
						{globalLoading ? this.renderLoading() : this.renderSidebar()}

						<Modals />
						<Toast />

					</div>
				</React.Fragment>
			</IntlProvider>
		);
	}

}

App.propTypes = {
	disconnected: PropTypes.bool,
	inited: PropTypes.bool,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	globalLoading: PropTypes.bool.isRequired,
	accountId: PropTypes.string.isRequired,
	language: PropTypes.string.isRequired,
	networkName: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
	visibleBar: PropTypes.bool.isRequired,
	hideBar: PropTypes.func.isRequired,
};

App.defaultProps = {
	disconnected: true,
	inited: false,
};

export default withRouter(connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		inited: state.global.get('inited'),
		language: state.global.get('language'),
		visibleBar: state.global.get('visibleBar'),
		accountId: state.global.getIn(['activeUser', 'id']),
		networkName: state.global.getIn(['network', 'name']),
		disconnected: !state.global.get('isConnected'),
	}),
	(dispatch) => ({
		hideBar: () => dispatch(toggleBar(true)),
	}),
)(App));

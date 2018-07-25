import React from 'react';
import { Segment, Sidebar, Dimmer, Loader } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

import Assets from './AssetsComponent';
import Tokens from './TokensComponents';

class Wallet extends React.Component {

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

	renderContent() {
		return (
			<div className="wallet-wrap">
				<Assets />
				<Tokens />
			</div>
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
				<SidebarMenu visibleBar={this.state.visibleBar} onToggleSidebar={this.toggleSidebar} />
				<Sidebar.Pusher onClick={this.sidebarHide} dimmed={this.state.visibleBar}>
					<Segment basic className="wrapper">
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content">
							{/*
								!this.props.tokens ?
									this.renderLoading() :
									<div>
										{this.renderContent()}
									</div>
							*/}
							<div>
								{this.props.tokens}
								{this.renderContent()}
							</div>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

Wallet.propTypes = {
	tokens: PropTypes.any,
};

Wallet.defaultProps = {
	tokens: null,
};


export default connect(
	(state) => ({
		tokens: state.global.get('tokens'),
	}),
	() => ({}),
)(Wallet);

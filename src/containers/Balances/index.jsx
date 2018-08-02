import React from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';
import Assets from './AssetsComponent';
import Tokens from './TokensComponents';

import { hideBar } from '../../actions/GlobalActions';

class Balances extends React.Component {

	componentWillMount() {
		this.props.hideBar();
	}
	render() {
		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu />
				<Sidebar.Pusher
					dimmed={this.props.visibleBar}
					onClick={() => this.props.hideBar(this.props.visibleBar)}
				>
					<Segment basic className="wrapper">
						<Header />
						<div className="content">
							<div>
								<div className="wallet-wrap">
									<Assets />
									<Tokens />
								</div>
							</div>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}


Balances.propTypes = {
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
)(Balances);

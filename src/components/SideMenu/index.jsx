import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import { toggleBar, hideBar } from '../../actions/GlobalActions';
import {
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	ADD_CONTRACT_PATH,
	BALANCES_PATH,
	INDEX_PATH,
} from '../../constants/RouterConstants';

class SidebarMenu extends React.Component {

	render() {

		return (
			<div>
				<Sidebar as={Menu} animation="overlay" vertical visible={this.props.visibleBar}>
					<div className="sidebar-header">
						<div className="sidebar-logo">echo</div>
						<div className="sidebar-close">
							<span
								className="icon-close"
								onKeyPress={() => this.props.toggleBar(this.props.visibleBar)}
								onClick={() => this.props.toggleBar(this.props.visibleBar)}
								role="button"
								tabIndex="0"
							/>
						</div>
						<span
							className="icon-menu"
							onKeyPress={() => this.props.toggleBar(this.props.visibleBar)}
							onClick={() => this.props.toggleBar(this.props.visibleBar)}
							role="button"
							tabIndex="0"
						/>
					</div>
					<div className="sidebar-body">
						<ul className="sidebar-nav">
							<li>
								<NavLink
									exact
									className="sidebar-nav-link"
									onClick={() => this.props.hideBar()}
									to={BALANCES_PATH}
								>
									<span className="icon icon-menu-wallet" />
									<span className="sidebar-nav-text">Wallet</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									exact
									className="sidebar-nav-link"
									onClick={() => this.props.hideBar()}
									to={CREATE_CONTRACT_PATH}
								>
									<span className="icon icon-contractAdd" />
									<span className="sidebar-nav-text">Create Smart Contract</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									exact
									className="sidebar-nav-link"
									to={CONTRACT_LIST_PATH}
									onClick={() => this.props.hideBar()}
								>
									<span className="icon icon-contractSearch" />
									<span className="sidebar-nav-text">View Smart Contract</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									exact
									className="sidebar-nav-link"
									to={ADD_CONTRACT_PATH}
									onClick={() => this.props.hideBar()}
								>
									<span className="icon icon-contractCopy" />
									<span className="sidebar-nav-text">Added Smart Contract</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									className="sidebar-nav-link"
									exact
									to={INDEX_PATH}
									onClick={() => this.props.hideBar()}
								>
									<span className="icon icon-recent-activity" />
									<span className="sidebar-nav-text">Recent Activity</span>
								</NavLink>
							</li>
						</ul>
					</div>

				</Sidebar>
			</div>
		);
	}

}

SidebarMenu.propTypes = {

	visibleBar: PropTypes.bool.isRequired,
	toggleBar: PropTypes.func.isRequired,
	hideBar: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		visibleBar: state.global.get('visibleBar'),
	}),
	(dispatch) => ({
		toggleBar: (value) => dispatch(toggleBar(value)),
		hideBar: () => dispatch(hideBar()),
	}),
)(SidebarMenu));


import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';

import { toggleBar } from '../../actions/GlobalActions';
import {
	CONTRACT_LIST_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	ACTIVITY_PATH,
	PERMISSIONS_PATH,
	INDEX_PATH,
	VIEW_TRANSACTION_PATH,
} from '../../constants/RouterConstants';

class SidebarMenu extends React.Component {

	renderMenuWalet(parsedLocation) {
		return (
			<li>
				<NavLink
					exact
					className="sidebar-nav-link"
					onClick={() => this.props.hideBar()}
					to={INDEX_PATH}
					replace={INDEX_PATH === parsedLocation}
				>
					<span className="icon icon-menu-wallet" />
					<span className="sidebar-nav-text">Wallet</span>
				</NavLink>
			</li>
		);
	}

	renderRecentActivity(parsedLocation) {
		return (
			<li>
				<NavLink
					exact
					className={classnames('sidebar-nav-link', { active: VIEW_TRANSACTION_PATH === parsedLocation })}
					onClick={() => this.props.hideBar()}
					to={ACTIVITY_PATH}
					replace={ACTIVITY_PATH === parsedLocation}
				>
					<span className="icon icon-recent-activity" />
					<span className="sidebar-nav-text">Recent Activity</span>
				</NavLink>
			</li>
		);
	}

	renderSmartContracts(parsedLocation) {
		return (
			<li>
				<NavLink
					exact
					className={classnames('sidebar-nav-link', {
						active: [
							CONTRACT_LIST_PATH,
							ADD_CONTRACT_PATH,
							CREATE_CONTRACT_PATH,
							CALL_CONTRACT_PATH].includes(parsedLocation),
					})}
					onClick={() => this.props.hideBar()}
					to={CONTRACT_LIST_PATH}
					replace={CONTRACT_LIST_PATH === parsedLocation}
				>
					<span className="icon icon-contractSearch" />
					<span className="sidebar-nav-text">Smart Contracts</span>
				</NavLink>
			</li>
		);
	}

	renderPermissions(parsedLocation) {
		return (
			<li>
				<NavLink
					exact
					className="sidebar-nav-link"
					onClick={() => this.props.hideBar()}
					replace={PERMISSIONS_PATH === parsedLocation}
					to={PERMISSIONS_PATH}
				>
					<span className="icon icon-permission" />
					<span className="sidebar-nav-text">Permissions</span>
				</NavLink>
			</li>
		);
	}

	render() {
		const {
			location,
		} = this.props;
		const parsedLocation = `/${location.pathname.split('/')[1]}`;
		return (
			<div>
				<Sidebar as={Menu} animation="overlay" vertical visible={this.props.visibleBar}>
					<div className="sidebar-header">
						<div className="sidebar-logo" />
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
							{
								this.props.visibleBar ? this.renderMenuWalet(parsedLocation) : <Popup
									content="Wallet"
									className="nav-popup"
									trigger={this.renderMenuWalet(parsedLocation)}
								/>
							}
							{
								this.props.visibleBar ? this.renderRecentActivity(parsedLocation) : <Popup
									content="Recent Activity"
									className="nav-popup"
									trigger={this.renderRecentActivity(parsedLocation)}
								/>
							}
							{
								this.props.visibleBar ? this.renderSmartContracts(parsedLocation) : <Popup
									content="Smart Contracts"
									className="nav-popup"
									trigger={this.renderSmartContracts(parsedLocation)}
								/>
							}
							{
								this.props.visibleBar ? this.renderPermissions(parsedLocation) : <Popup
									content="Permissions"
									className="nav-popup"
									trigger={this.renderPermissions(parsedLocation)}
								/>
							}
						</ul>
					</div>

				</Sidebar>
			</div>
		);
	}

}

SidebarMenu.propTypes = {
	location: PropTypes.object.isRequired,
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
		hideBar: () => dispatch(toggleBar(true)),
	}),
)(SidebarMenu));

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';
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
	COMMITTEE_VOTE_PATH,
} from '../../constants/RouterConstants';

class SidebarMenu extends React.Component {

	render() {
		const {
			location,
		} = this.props;
		const parsedLocation = `/${location.pathname.split('/')[1]}`;
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
									to={INDEX_PATH}
									replace={INDEX_PATH === parsedLocation}
								>
									<span className="icon icon-menu-wallet" />
									<span className="sidebar-nav-text">Wallet</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									className={classnames('sidebar-nav-link', { active: VIEW_TRANSACTION_PATH === parsedLocation })}
									exact
									to={ACTIVITY_PATH}
									onClick={() => this.props.hideBar()}
									replace={ACTIVITY_PATH === parsedLocation}
								>
									<span className="icon icon-recent-activity" />
									<span className="sidebar-nav-text">Recent Activity</span>
								</NavLink>
							</li>
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
							<li>
								<NavLink
									exact
									className="sidebar-nav-link"
									onClick={() => this.props.hideBar()}
									replace={COMMITTEE_VOTE_PATH === parsedLocation}
									to={COMMITTEE_VOTE_PATH}
								>
									<span className="icon icon-menu-voting" />
									<span className="sidebar-nav-text">Voting</span>
								</NavLink>
							</li>
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

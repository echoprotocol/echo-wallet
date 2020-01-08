import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import NavPopup from './NavPopup';
import classnames from 'classnames';

import { toggleBar } from '../../actions/GlobalActions';
import {
	CONTRACT_LIST_PATH,
	ADD_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	CALL_CONTRACT_PATH,
	ACTIVITY_PATH,
	PERMISSIONS_PATH,
	INDEX_PATH,
	VIEW_TRANSACTION_PATH,
} from '../../constants/RouterConstants';

import wallet from '../../assets/animations/wallet.json';
import activity from '../../assets/animations/activity.json';
import contracts from '../../assets/animations/contract.json';
import permissions from '../../assets/animations/permissions.json';
import AnimatedIcon from '../AnimatedIcon';

class SidebarMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			prevLink: null,
			currentLink: null,
			walletStopped: true,
			activityStopped: true,
			contractsStopped: true,
			permissionsStopped: true,
		};
		this.navList = React.createRef();
	}

	componentDidMount() {
		this.updateLink();
		setTimeout(() => {
			this.addActive();
		}, 0);
	}

	componentDidUpdate(prevProps) {
		const {
			location,
		} = this.props;
		if (prevProps.location.pathname !== location.pathname) {
			this.animateIcon(location);
			this.updateLink();
			setTimeout(() => {
				this.addAnimation();
			}, 0);
		}
	}

	addActive() {
		const menu = this.navList.current;
		const { currentLink } = this.state;
		const links = menu.querySelectorAll('.sidebar-nav-link');
		links.forEach((link, id) => {
			if (id === currentLink) {
				link.classList.add('show');
			}
		});
	}

	animateIcon(location) {
		switch (location.pathname) {
			case '/':
				this.playIconAnimation('wallet');
				break;
			case '/activity':
				this.playIconAnimation('activity');
				break;
			case '/contracts':
				this.playIconAnimation('contracts');
				break;
			case '/permissions':
				this.playIconAnimation('permissions');
				break;
			default:
				return false;
		}
		return false;
	}

	playIconAnimation(iconName) {
		if (this.state[`${iconName}Stopped`] === false) {
			return false;
		}
		this.setState({
			[`${iconName}Stopped`]: false,
		});
		setTimeout(() => {
			this.setState({
				[`${iconName}Stopped`]: true,
			});
		}, 1000);
		return false;
	}

	addAnimation() {
		const menu = this.navList.current;
		const prevId = this.state.prevLink;
		const currentId = this.state.currentLink;
		const links = menu.querySelectorAll('.sidebar-nav-link');
		links.forEach((link, id) => {
			link.classList.remove('fade-up');
			link.classList.remove('fade-down');
			link.classList.remove('show-up');
			link.classList.remove('show-down');
			if (id === currentId) {
				link.classList.add(currentId > prevId ? 'show-up' : 'show-down');
			} else if (id === prevId) {
				link.classList.add(currentId < prevId ? 'fade-up' : 'fade-down');
			}
		});
	}

	updateLink() {
		const {
			location,
		} = this.props;
		const prev = this.state.currentLink;
		switch (location.pathname) {
			case '/':
				this.setState({
					prevLink: prev,
					currentLink: 0,
				});
				break;
			case '/activity':
				this.setState({
					prevLink: prev,
					currentLink: 1,
				});
				break;
			case '/contracts':
				this.setState({
					prevLink: prev,
					currentLink: 2,
				});
				break;
			case '/permissions':
				this.setState({
					prevLink: prev,
					currentLink: 3,
				});
				break;
			default:
				this.setState({
					prevLink: prev,
					currentLink: 0,
				});
		}
	}

	renderMenuWalet(parsedLocation) {
		const { visibleBar } = this.props;
		return (
			<li>
				<NavLink
					exact
					className="sidebar-nav-link"
					onClick={() => {
						this.props.hideBar();
					}}
					to={INDEX_PATH}
					replace={INDEX_PATH === parsedLocation}
				>
					<AnimatedIcon
						data={wallet}
						isStopped={this.state.walletStopped}
						width={25}
						height={35}
					/>
					<span className="sidebar-nav-text">
						<FormattedMessage id="wallet_page.title" />
					</span>
				</NavLink>
				<NavPopup value="Wallet" visible={!visibleBar} wait={500} />
			</li>
		);
	}

	renderRecentActivity(parsedLocation) {
		const { visibleBar } = this.props;
		return (
			<li>
				<NavLink
					exact
					className={classnames('sidebar-nav-link', { active: VIEW_TRANSACTION_PATH === parsedLocation })}
					onClick={() => {
						this.props.hideBar();
					}}
					to={ACTIVITY_PATH}
					replace={ACTIVITY_PATH === parsedLocation}
				>
					<AnimatedIcon
						data={activity}
						isStopped={this.state.activityStopped}
						width={25}
						height={35}
					/>
					<span className="sidebar-nav-text">
						<FormattedMessage id="recent_activity_page.title" />
					</span>
				</NavLink>
				<NavPopup value="Recent Activity" visible={!visibleBar} wait={500} />
			</li>
		);
	}

	renderSmartContracts(parsedLocation) {
		const { visibleBar } = this.props;
		return (
			<li>
				<NavLink
					exact
					className={classnames('sidebar-nav-link', {
						active: [
							CONTRACT_LIST_PATH,
							ADD_CONTRACT_PATH,
							SMART_CONTRACTS_PATH,
							CALL_CONTRACT_PATH].includes(parsedLocation),
					})}
					onClick={() => this.props.hideBar()}
					to={CONTRACT_LIST_PATH}
					replace={CONTRACT_LIST_PATH === parsedLocation}
				>
					<AnimatedIcon
						data={contracts}
						isStopped={this.state.contractsStopped}
						width={25}
						height={35}
					/>
					<span className="sidebar-nav-text">
						<FormattedMessage id="smart_contract_page.title" />
					</span>
				</NavLink>
				<NavPopup value="Smart Contracts" visible={!visibleBar} wait={500} />
			</li>
		);
	}

	renderPermissions(parsedLocation) {
		const { visibleBar } = this.props;
		return (
			<li>
				<NavLink
					exact
					className="sidebar-nav-link"
					onClick={() => this.props.hideBar()}
					replace={PERMISSIONS_PATH === parsedLocation}
					to={PERMISSIONS_PATH}
				>
					<AnimatedIcon
						data={permissions}
						isStopped={this.state.permissionsStopped}
						width={25}
						height={40}
					/>
					<span className="sidebar-nav-text">
						<FormattedMessage id="backup_and_permissions_page.title" />
					</span>
				</NavLink>
				<NavPopup value="Backup and Permissions" visible={!visibleBar} wait={500} />
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
							<button
								className="icon-close"
								onClick={() => {
									this.props.toggleBar(this.props.visibleBar);
								}}
							/>
						</div>
						<span
							className="icon-menu"
							onKeyPress={() => this.props.toggleBar(this.props.visibleBar)}
							onClick={() => {
								this.props.toggleBar(this.props.visibleBar);
							}}
							role="button"
							tabIndex="0"
						/>
					</div>
					<div className="sidebar-body">
						<ul className="sidebar-nav" ref={this.navList}>
							{
								this.renderMenuWalet(parsedLocation)
							}
							{
								this.renderRecentActivity(parsedLocation)
							}
							{
								this.renderSmartContracts(parsedLocation)
							}
							{
								this.renderPermissions(parsedLocation)
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

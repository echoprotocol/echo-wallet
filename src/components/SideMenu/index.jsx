import React from 'react';
import { Accordion, Menu, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../actions/GlobalActions';
import { openModal } from '../../actions/ModalActions';

import { MODAL_UNLOCK } from '../../constants/ModalConstants';

class SidebarMenu extends React.Component {

	constructor() {
		super();
		this.state = { activeIndex: -1 };
		this.handleClick = this.handleClick.bind(this);
	}

	onLogout() {
		this.props.logout();
	}

	handleClick(e, titleProps) {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;
		this.setState({ activeIndex: newIndex });
	}

	lockAccount() {
		this.props.openModal(MODAL_UNLOCK);
	}

	render() {
		const { activeIndex } = this.state;
		return (
			<div>
				<Sidebar as={Menu} animation="overlay" vertical visible={this.props.visibleBar}>
					<div className="sidebar-header">
						{
							this.props.visibleBar ?
								<React.Fragment>
									<div className="sidebar-logo">echo</div>
									<div className="sidebar-close">
										<span
											className="icon-close"
											onClick={this.props.onToggleSidebar}
											onKeyPress={this.props.onToggleSidebar}
											role="button"
											tabIndex="0"
										/>
									</div>
								</React.Fragment> :
								<span
									className="icon-menu"
									onClick={this.props.onToggleSidebar}
									onKeyPress={this.props.onToggleSidebar}
									role="button"
									tabIndex="0"
								/>
						}
					</div>
					<div className="sidebar-body">
						<ul className="sidebar-nav">
							<li>
								<Link className="sidebar-nav-link" to="/">
									<span className="icon icon-menu_1" />
									<span className="sidebar-nav-text">Create Payment</span>
								</Link>
							</li>
							<Accordion as="li" className={`accordion-smart-contract ${this.state.activeIndex === (-1) ? '' : 'opened'}`}>
								<Accordion.Title
									active={activeIndex === 1}
									index={1}
									onClick={this.handleClick}
								>
									<span className="icon icon-menu_2" />
									<span className="sidebar-nav-text">Smart Contract</span>
								</Accordion.Title>
								<Accordion.Content active={activeIndex === 1}>
									<div key="0" className="accordeon-item">
										<Link className="sidebar-nav-sublink" to="/">
											{ this.props.visibleBar ?
												'Create Smart Contract' :
												<span className="icon icon-contractAdd" />
											}
										</Link>
									</div>
									<div key="1" className="accordeon-item">
										<Link className="sidebar-nav-sublink" to="/">
											{ this.props.visibleBar ?
												'View Smart Contracts' :
												<span className="icon icon-contractSearch" />
											}
										</Link>
									</div>
									<div key="2" className="accordeon-item">
										<Link className="sidebar-nav-sublink" to="/">
											{ this.props.visibleBar ?
												'Added Smart Contracts' :
												<span className="icon icon-contractCopy" />
											}
										</Link>
									</div>
								</Accordion.Content>
							</Accordion>
							<li>
								<Link className="sidebar-nav-link" to="/activity">
									<span className="icon icon-menu_3" />
									<span className="sidebar-nav-text">Recent Activity</span>
								</Link>
							</li>
							<li>
								<Link className="sidebar-nav-link" to="/">
									<span className="icon icon-menu_4" />
									<span className="sidebar-nav-text">Voting</span>
								</Link>
							</li>
							{/* <li>
								<div className="sidebar-nav-link">
                                    <Button
                                        content="Unlock"
                                        size="mini"
                                        color="grey"
                                        onClick={() => this.lockAccount()}
                                    />
								</div>
							</li> */}
						</ul>
					</div>

				</Sidebar>
			</div>
		);
	}

}

SidebarMenu.propTypes = {
	visibleBar: PropTypes.bool,
	onToggleSidebar: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
};

SidebarMenu.defaultProps = {
	visibleBar: false,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		openModal: (value) => dispatch(openModal(value)),
	}),
)(SidebarMenu);

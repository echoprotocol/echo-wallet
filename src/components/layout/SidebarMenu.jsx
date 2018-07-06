import React from 'react';
import { Accordion, Menu, Sidebar } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const smartContracts = [
	<div key="0" className="accordeon-item">
		<Link className="sidebar-nav-sublink" to="/">Create Smart Contract</Link>
	</div>,
	<div key="1" className="accordeon-item">
		<Link className="sidebar-nav-sublink" to="/">View Smart Contracts</Link>
	</div>,
	<div key="2" className="accordeon-item">
		<Link className="sidebar-nav-sublink" to="/">Added Smart Contracts</Link>
	</div>,
];


export default class SidebarMenu extends React.Component {

	constructor() {
		super();
		this.state = { activeIndex: -1 };
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e, titleProps) {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;
		this.setState({ activeIndex: newIndex });
	}
	render() {
		const { activeIndex } = this.state;
		return (
			<div>
				<Sidebar as={Menu} animation="overlay" vertical visible={this.props.visibleBar} width="wide">
					<div className="sidebar-header">
						<div className="sidebar-logo">echo</div>
						<div className="sidebar-close">
							<span className="icon-close" onClick={this.props.onToggleSidebar} onKeyPress={this.props.onToggleSidebar} role="button" tabIndex="0" />
						</div>
					</div>
					<div className="sidebar-body">
						<ul className="sidebar-nav">
							<li>
								<Link className="sidebar-nav-link" to="/">
									<span className="icon icon-menu_1" />
                                    Create Payment
								</Link>
							</li>
							<Accordion as="li" className={`accordion-smart-contract ${this.state.activeIndex === (-1) ? '' : 'opened'}`}>
								<Accordion.Title
									active={activeIndex === 1}
									content="Smart Contract"
									index={1}
									onClick={this.handleClick}
								/>
								<Accordion.Content active={activeIndex === 1} content={smartContracts} />
							</Accordion>
							<li>
								<Link className="sidebar-nav-link" to="/">
									<span className="icon icon-menu_3" />
                                    Recent Activity
								</Link>
							</li>
							<li>
								<Link className="sidebar-nav-link" to="/">
									<span className="icon icon-menu_4" />
                                    Voting
								</Link>
							</li>
						</ul>
					</div>
					<div className="sidebar-footer">
						<div className="user-info">
							<span className="icon icon-menu_5" />
							<div className="user">
								<div className="user-name">valik_pruss456</div>
								<div className="user-action">Logout</div>
							</div>
						</div>
					</div>

				</Sidebar>
			</div>
		);
	}

}

SidebarMenu.propTypes = {
	visibleBar: PropTypes.bool,
	onToggleSidebar: PropTypes.func.isRequired,
};

SidebarMenu.defaultProps = {
	visibleBar: false,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Header extends React.PureComponent {

	render() {

		return (
			<div className="header" >
				<div className="show-sidebar-btn" onClick={this.props.onToggleSidebar} onKeyPress={this.props.onToggleSidebar} role="button" tabIndex="0">
					<span className="icon-menu" />
				</div>
				<div className="page-title"> Smart Contracts </div>
				<ul className="header-temp">
					<li><Link to="/sign-in">Sign In</Link></li>
					<li><Link to="/sign-up">Sign Up</Link></li>
					<li><Link to="/">Activity</Link></li>
				</ul>
			</div>
		);
	}

}

Header.propTypes = {
	onToggleSidebar: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.PureComponent {

	render() {
		const { title } = this.props;

		return (
			<div className="header">
				<div className="show-sidebar-btn" onClick={this.props.onToggleSidebar} onKeyPress={this.props.onToggleSidebar} role="button" tabIndex="0">
					<span className="icon-menu" />
				</div>
				<div className="page-title">{title}</div>
				<ul className="header-temp">
					<li><Link to="/sign-in">Sign In</Link></li>
					<li><Link to="/sign-up">Sign Up</Link></li>
					<li><Link to="/activity">Activity</Link></li>
				</ul>
			</div>
		);
	}

}

Header.propTypes = {
	title: PropTypes.string.isRequired,
	onToggleSidebar: PropTypes.func.isRequired,
};

export default connect((state) => ({
	title: state.global.get('title'),
}))(Header);

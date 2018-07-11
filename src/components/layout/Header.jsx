import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { HEADER_TITLE } from '../../constants/GlobalConstants';

class Header extends React.PureComponent {

	getTitle() {
		const { location } = this.props;
		return HEADER_TITLE.filter((title) => title.path === location.pathname)[0].title;
	}

	render() {

		return (
			<div className="header">
				<div className="show-sidebar-btn" onClick={this.props.onToggleSidebar} onKeyPress={this.props.onToggleSidebar} role="button" tabIndex="0">
					<span className="icon-menu" />
				</div>
				<div className="page-title">{this.getTitle()}</div>
			</div>
		);
	}

}

Header.propTypes = {
	location: PropTypes.object.isRequired,
	onToggleSidebar: PropTypes.func.isRequired,
};

export default withRouter(connect()(Header));

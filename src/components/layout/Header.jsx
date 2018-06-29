import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {

	render() {

		return (
			<ul className="header" >
				<li><Link to="/sign-in">Sign In</Link></li>
				<li><Link to="/sign-up">Sign Up</Link></li>
				<li><Link to="/">Activity</Link></li>
				
				
				
			</ul>
		);
	}

}

export default Header;

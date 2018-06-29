import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {

	render() {

		return (
			<div className="header" >
				HEADER: 
				<Link to="/sign-up">Sign Up page</Link>
				<Link to="/sign-in">Sign In page</Link>
				<Link to="/">Home page</Link>
			</div>
		);
	}

}

export default Header;

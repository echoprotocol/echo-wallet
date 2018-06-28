import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent {

	render() {

		return (
			<div className="header" >
				HEADER: 
				<Link to="/about">About page</Link>
				<Link to="/">Home page</Link>
			</div>
		);
	}

}

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {

	render() {
		return (
			<div>
				Home page
				<br />
				<Link to="/about">About page</Link>
			</div>
		);
	}

}

export default HomePage;

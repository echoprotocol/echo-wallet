import React from 'react';
import { Link } from 'react-router-dom';

class AboutPage extends React.Component {

	render() {

		return (
			<div className="about_page">
				About Page Content
				<br />
				<Link to="/">Back to home</Link>
			</div>
		);
	}

}

export default AboutPage;

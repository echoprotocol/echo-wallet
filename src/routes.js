import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Home from './components/pages/home/HomePage';
import About from './components/pages/about/AboutPage';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path="/" component={Home} />
					<Route exact path="/about" component={About} />
				</div>
			</App>
		);
	}

}

import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Home from './components/pages/home/HomePage';
import About from './components/pages/about/AboutPage';
import SignIn from './components/pages/signIn/signInPage';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path="/" component={Home} />
					<Route exact path="/about" component={About} />
					<Route exact path="/sign-in" component={SignIn} />
				</div>
			</App>
		);
	}

}

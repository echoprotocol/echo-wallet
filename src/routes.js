import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Activity from './components/pages/activity/ActivityPage';
import SignUp from './components/pages/signUp/SignUpPage';
import SignIn from './components/pages/signIn/signInPage';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path="/" component={Activity} />
					<Route exact path="/sign-up" component={SignUp} />
					<Route exact path="/sign-in" component={SignIn} />
				</div>
			</App>
		);
	}

}

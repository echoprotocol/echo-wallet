import React from 'react';
import { Redirect, Route } from 'react-router';

import {
	SIGN_UP_PATH,
	SIGN_IN_PATH,
	ACTIVITY_PATH,
} from './constants/RouterConstants';

import App from './containers/App';
import Activity from './containers/Activity';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					{ /* TODO rm after home page will be present */}
					<Route exact path="/" render={() => (<Redirect to={ACTIVITY_PATH} />)} />

					<Route exact path={ACTIVITY_PATH} component={Activity} />
					<Route exact path={SIGN_UP_PATH} component={SignUp} />
					<Route exact path={SIGN_IN_PATH} component={SignIn} />
				</div>
			</App>
		);
	}

}

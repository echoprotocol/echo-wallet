import React from 'react';
import { Route } from 'react-router';

import {
	SIGN_UP_PATH,
	SIGN_IN_PATH,
	ACTIVITY_PATH,
	TRANSFER_PATH,
} from './constants/RouterConstants';

import App from './containers/App';
import Activity from './containers/Activity';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import Transfer from './containers/Transfer';


export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path={ACTIVITY_PATH} component={Activity} />
					<Route exact path={SIGN_UP_PATH} component={SignUp} />
					<Route exact path={SIGN_IN_PATH} component={SignIn} />
					<Route exact path={TRANSFER_PATH} component={Transfer} />
				</div>
			</App>
		);
	}

}

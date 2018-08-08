import React from 'react';
import { Route } from 'react-router';

import {
	INDEX_PATH,
	SIGN_UP_PATH,
	SIGN_IN_PATH,
	BALANCES_PATH,
	TRANSFER_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	VIEW_CONTRACTS_PATH,
} from './constants/RouterConstants';

import App from './containers/App';
import Activity from './containers/Activity';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import SmartContracts from './containers/SmartContracts';
import ViewContracts from './containers/ViewContracts';
import AddContract from './containers/AddContract';
import Balances from './containers/Balances';
import Transfer from './containers/Transfer';
import CreateContract from './containers/CreateContract';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path={INDEX_PATH} component={Activity} />
					<Route exact path={SIGN_UP_PATH} component={SignUp} />
					<Route exact path={SIGN_IN_PATH} component={SignIn} />
					<Route exact path={BALANCES_PATH} component={Balances} />
					<Route exact path={TRANSFER_PATH} component={Transfer} />
					<Route exact path={ADD_CONTRACT_PATH} component={AddContract} />
					<Route exact path={CREATE_CONTRACT_PATH} component={CreateContract} />
					<Route exact path={SMART_CONTRACTS_PATH} component={SmartContracts} />
					<Route exact path={VIEW_CONTRACTS_PATH} component={ViewContracts} />
				</div>
			</App>
		);
	}

}

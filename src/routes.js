import React from 'react';
import { Route } from 'react-router';

import {
	INDEX_PATH,
	SIGN_UP_PATH,
	SIGN_IN_PATH,
	ACTIVITY_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	VIEW_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
	CALL_CONTRACT_PATH,
	NETWORKS_PATH,
	PERMISSIONS_PATH,
	CREATE_PASSWORD_PATH,
	FROZEN_FUNDS_PATH,
} from './constants/RouterConstants';

import App from './containers/App';
import Activity from './containers/Activity';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import ContractList from './containers/ContractList';
import ViewContract from './containers/ViewContract';
import AddContract from './containers/AddContract';
import Wallet from './containers/Wallet';
import CreateContract from './containers/CreateContract';
import ViewTransaction from './containers/ViewTransaction';
import CallContract from './containers/CallContract';
import Networks from './containers/Networks';
import Permissions from './containers/Permissions';
import Password from './containers/Password';
import FrozenFunds from './containers/FrozenFunds';

export default class Routes extends React.Component {

	render() {
		return (
			<App>
				<div>
					<Route exact path={INDEX_PATH} component={Wallet} />
					<Route exact path={SIGN_UP_PATH} component={SignUp} />
					<Route exact path={SIGN_IN_PATH} component={SignIn} />
					<Route exact path={ACTIVITY_PATH} component={Activity} />
					<Route exact path={ADD_CONTRACT_PATH} component={AddContract} />
					<Route exact path={CREATE_CONTRACT_PATH} component={CreateContract} />
					<Route exact path={CONTRACT_LIST_PATH} component={ContractList} />
					<Route exact path={VIEW_CONTRACT_PATH} component={ViewContract} />
					<Route exact path={VIEW_TRANSACTION_PATH} component={ViewTransaction} />
					<Route exact path={CALL_CONTRACT_PATH} component={CallContract} />
					<Route exact path={NETWORKS_PATH} component={Networks} />
					<Route exact path={PERMISSIONS_PATH} component={Permissions} />
					<Route exact path={CREATE_PASSWORD_PATH} component={Password} />
					<Route exact path={FROZEN_FUNDS_PATH} component={FrozenFunds} />
				</div>
			</App>
		);
	}

}

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
	CONTRACT_LIST_PATH,
	VIEW_CONTRACT_PATH,
	VIEW_TRANSACTION_PATH,
	CALL_CONTRACT_PATH,
	PERMISSIONS_PATH,
} from './constants/RouterConstants';

import App from './containers/App';
import Activity from './containers/Activity';
import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import ContractList from './containers/ContractList';
import ViewContract from './containers/ViewContract';
import AddContract from './containers/AddContract';
import Balances from './containers/Balances';
import Transfer from './containers/Transfer';
import CreateContract from './containers/CreateContract';
import ViewTransaction from './containers/ViewTransaction';
import CallContract from './containers/CallContract';
import Permissions from './containers/Permissions';

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
					<Route exact path={CONTRACT_LIST_PATH} component={ContractList} />
					<Route exact path={VIEW_CONTRACT_PATH} component={ViewContract} />
					<Route exact path={VIEW_TRANSACTION_PATH} component={ViewTransaction} />
					<Route exact path={CALL_CONTRACT_PATH} component={CallContract} />
					<Route exact path={PERMISSIONS_PATH} component={Permissions} />

				</div>
			</App>
		);
	}

}

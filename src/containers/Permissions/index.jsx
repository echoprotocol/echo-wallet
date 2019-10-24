import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { CACHE_MAPS } from 'echojs-lib';

import PrivateKeyScenario from '../PrivateKeyScenario';
// import PermissionTable from './PermissionTable';
import ViewModeTable from './ViewModeTable';

import { formPermissionKeys, clear, permissionTransaction, isChanged } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';
// import TransactionScenario from '../TransactionScenario';
import { clearForm, setInFormValue, setValue } from '../../actions/FormActions';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class Permissions extends React.Component {

	componentWillMount() {
		this.props.formPermissionKeys();
	}

	componentDidUpdate(prevProps) {
		if (_.isEqual(prevProps, this.props)) {
			return;
		}

		const { accountName: prevAccountName } = prevProps;
		const { accountName } = this.props;
		const prevAccount = prevProps.account.toJS();
		const account = this.props.account.toJS();

		if (!prevAccount && account) {
			this.props.formPermissionKeys();
			return;
		}

		if (prevAccountName !== accountName) {
			this.props.formPermissionKeys();
			return;
		}

		if (!_.isEqual(prevAccount.active, account.active)) {
			this.props.formPermissionKeys();
		}
	}

	componentWillUnmount() {
		this.props.clear();
		this.props.clearForm();
	}

	onCancel(data) {
		this.props.clearForm();

		const roles = ['active'];

		roles.forEach((role) => {
			if (data[role].threshold) {
				this.props.setValue([role, 'threshold'], data[role].threshold);
			}

			if (!data[role].keys) {
				return;
			}

			data[role].keys.forEach((k) => {
				this.props.setValue([role, 'keys', k.key, 'key'], k.key);
				this.props.setValue([role, 'keys', k.key, 'weight'], k.weight);
			});
		});
	}

	render() {
		const permissionsKeys = this.props.permissionsKeys.toJS();
		const {
			keys,
			set,
			firstFetch,
		} = this.props;

		const active = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};

		const echoRand = {
			keys: permissionsKeys.echoRand.keys,
		};

		return (
			<div className="permissions-wrap">
				<div className="sub-header">

					<div className="account-info">
						<span className="account-info-type">Account ID:</span>
						<span className="account-info-value">1.16.0</span>
					</div>
					<div className="sub-header-panel">
						<Button
							className="grey"
							content="Edit mode"
						/>
						<Button
							className="green"
							content="View & backup keys"
						/>
					</div>
				</div>
				<PrivateKeyScenario>
					{
						(privateKeys, submit) => (
							<React.Fragment>
								<ViewModeTable
									keyRole="active"
									table="Active"
									title="Public Keys and Accounts"
									description="Making a backup of your keys helps ensure you can always maintain access to your funds.
									Anyone having access to your keys will take full control of the funds,
									so we strongly recommend storing it offline in a secure place."
									data={active}
									keys={keys}
									privateKeys={privateKeys}
									submit={submit}
									set={set}
									setValue={this.props.setValue}
									isChanged={this.props.isChanged}
									firstFetch={firstFetch}
								/>
							</React.Fragment>
						)
					}
				</PrivateKeyScenario>
				<PrivateKeyScenario>
					{
						(privateKeys, submit) => (
							<React.Fragment>
								<ViewModeTable
									keyRole="echoRand"
									table="Echo rand"
									description="EchoRand Key is used for participating in blocks generation and signing sidechain transactions by committee members."
									headerLinkText=" Know more in Echo Docs"
									headerLinkUrl="https://docs.echo.org/"
									title="EchoRand Key"
									advanced="(advanced)"
									data={echoRand}
									keys={keys}
									privateKeys={privateKeys}
									submit={submit}
									set={set}
									setValue={this.props.setValue}
									isChanged={this.props.isChanged}
									firstFetch={firstFetch}
								/>
							</React.Fragment>
						)
					}
				</PrivateKeyScenario>
				{/* <TransactionScenario handleTransaction={() => this.props.permissionTransaction()}>
					{
						(submitTr) => (
							this.props.isChanged &&
								<div className="top-btn-container">
									<Button
										basic
										className="txt-btn"
										content="Cancel"
										onClick={() => this.onCancel({ active })}
									/>
									<Button
										basic
										className="green"
										content="Save"
										onClick={submitTr}
									/>
								</div>
						)
					}
				</TransactionScenario>
				<PrivateKeyScenario>
					{
						(keys, submit) => (
							<React.Fragment>
								<PermissionTable
									keyRole="active"
									table="Active"
									description="Active key allows you to sign transactions Use this key to log in into wallets."
									data={active}
									keys={keys}
									submit={submit}
									resetAddKeys={this.state.resetAddKeys}
								/>
							</React.Fragment>
						)
					}
				</PrivateKeyScenario> */}
			</div>
		);
	}

}

Permissions.propTypes = {
	accountName: PropTypes.string.isRequired,
	isChanged: PropTypes.bool.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	account: PropTypes.object,
	formPermissionKeys: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	permissionTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	keys: PropTypes.object.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	set: PropTypes.func.isRequired,
};

Permissions.defaultProps = {
	account: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		return {
			keys: state.form.get(FORM_PERMISSION_KEY),
			accountName: state.global.getIn(['activeUser', 'name']),
			account: state.echojs.getIn([CACHE_MAPS.ACCOUNTS_BY_ID, accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
			isChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isChanged']),
			firstFetch: state.form.getIn([FORM_PERMISSION_KEY, 'firstFetch']),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
		permissionTransaction: () => dispatch(permissionTransaction()),
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
		set: (field, value) => dispatch(setValue(FORM_PERMISSION_KEY, field, value)),
		isChanged: () => dispatch(isChanged()),
	}),
)(Permissions);

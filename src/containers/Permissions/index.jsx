import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';

import PrivateKeyScenario from '../PrivateKeyScenario';
import PermissionTable from './PermissionTable';

import { formPermissionKeys, clear, permissionTransaction } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';
import TransactionScenario from '../TransactionScenario';
import { clearForm, setInFormValue } from '../../actions/FormActions';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class Permissions extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			resetAddKeys: false,
		};
	}

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

		if (
			!_.isEqual(prevAccount.active, account.active) ||
            prevAccount.options.memo_key !== account.options.memo_key
		) {
			this.props.formPermissionKeys();
		}
	}

	componentWillUnmount() {
		this.props.clear();
	}

	onCancel(data) {
		this.props.clearForm();

		this.setState({ resetAddKeys: true }, () => { this.setState({ resetAddKeys: false }); });

		const roles = ['active', 'memo'];

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
		let { permissionsKeys } = this.props;

		permissionsKeys = permissionsKeys.toJS();

		const active = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};

		const note = {
			keys: permissionsKeys.memo.keys,
		};

		return (

			<div className="permissions-wrap">
				<TransactionScenario
					handleTransaction={() => this.props.permissionTransaction()}
					form={FORM_PERMISSION_KEY}
				>
					{
						(submitTr) => (
							this.props.isChanged &&
								<div className="top-btn-container">
									<Button
										basic
										className="txt-btn"
										content="Cancel"
										onClick={() => this.onCancel({ active, memo: note })}
									/>
									<Button
										basic
										className="main-btn green"
										content="SAVE"
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
									keys={keys.active}
									submit={submit}
									resetAddKeys={this.state.resetAddKeys}
								/>
							</React.Fragment>
						)
					}
				</PrivateKeyScenario>
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
};

Permissions.defaultProps = {
	account: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		return {
			accountName: state.global.getIn(['activeUser', 'name']),
			account: state.echojs.getIn(['data', 'accounts', accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
			isChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isChanged']),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
		permissionTransaction: () => dispatch(permissionTransaction()),
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
	}),
)(Permissions);

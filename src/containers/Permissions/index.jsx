import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button } from 'semantic-ui-react';
import PermissionTable from './PermissionTable';

import { formPermissionKeys, clear } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';

class Permissions extends React.Component {

	componentWillMount() {
		this.props.formPermissionKeys();
	}

	componentDidUpdate(prevProps) {
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
            !_.isEqual(prevAccount.owner, account.owner) ||
            prevAccount.options.memo_key !== account.options.memo_key
		) {
			this.props.formPermissionKeys();
		}
	}

	componentWillUnmount() {
		this.props.clear();
	}

	render() {
		let { permissionsKeys } = this.props;

		permissionsKeys = permissionsKeys.toJS();

		const active = permissionsKeys.active.keys.concat(permissionsKeys.active.accounts);
		const owner = permissionsKeys.owner.keys.concat(permissionsKeys.owner.accounts);
		const note = permissionsKeys.memo.keys;

		return (
			<div className="permissions-wrap">
				<div className="top-btn-container">
					<Button
						basic
						className="txt-btn"
						content="Cancel"
					/>
					<Button
						basic
						className="main-btn green"
						content="SAVE"
					/>
				</div>
				<PermissionTable table="Active Permissions" description="Active key allows you to sign transactions Use this key to log in into wallets." data={active} />
				<PermissionTable table="Owner Permissions" description="Owner key allows to overwrite all keys. Basicaly owner key allows you to control account." data={owner} />
				<PermissionTable noInput noBtn table="Note key" description="Note key is used to read notes from transactions." data={note} />
			</div>
		);
	}

}

Permissions.propTypes = {
	accountName: PropTypes.string.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	account: PropTypes.object.isRequired,
	formPermissionKeys: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		return {
			accountName: state.global.getIn(['activeUser', 'name']),
			account: state.echojs.getIn(['data', 'accounts', accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
	}),
)(Permissions);

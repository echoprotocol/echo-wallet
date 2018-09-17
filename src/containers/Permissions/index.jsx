import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
				<div className="permissions-info">
                    Active permissions define the accounts that
                    have permission to spend funds for this account.
                    They can be used to easily setup a multi-signature
                    scheme, see permissions for more details.
				</div>
				<PermissionTable table="Active" data={active} />
				<PermissionTable table="Owner" data={owner} />
				<PermissionTable table="Note" data={note} />
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

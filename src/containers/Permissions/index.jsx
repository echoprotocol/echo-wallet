import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PermissionTable from './PermissionTable';

class Permissions extends React.Component {

	render() {

		const { active, owner, note } = this.props;
		return (
			<div className="permissions-wrap">
				<div className="permissions-info">
                    Active permissions define the accounts that
                    have permission to spend funds for this account.
                    They can be used to easily setup a multi-signature
                    scheme, see <a className="link" href="#"> permissions</a> for more details.
				</div>

				<PermissionTable table="Active" data={active} />
				<PermissionTable table="Owner" data={owner} />
				<PermissionTable table="Note" data={note} />

			</div>
		);
	}

}

Permissions.propTypes = {
	active: PropTypes.array.isRequired,
	owner: PropTypes.array.isRequired,
	note: PropTypes.array.isRequired,
};

export default connect((state) => {
	const accountId = state.global.getIn(['activeUser', 'id']);
	const account = state.echojs.getIn(['data', 'accounts', accountId]).toJS();
	// const active = account.;
	const active = account.active.account_auths.concat(account.active.key_auths);
	const owner = account.owner.account_auths.concat(account.owner.key_auths);
	const note = [[account.options.memo_key]];

	return { active, owner, note };
})(Permissions);


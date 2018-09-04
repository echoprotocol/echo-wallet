import React from 'react';
import ActiveTable from './ActiveTable';
import OwnerTable from './OwnerTable';
import NoteTable from './NoteTable';

class Permissions extends React.Component {

	render() {
		return (
			<div className="permissions-wrap">
				<div className="permissions-info">
                    Active permissions define the accounts that
                    have permission to spend funds for this account.
                    They can be used to easily setup a multi-signature
                    scheme, see <a className="link" href="#"> permissions</a> for more details.
				</div>

				<ActiveTable />
				<OwnerTable />
				<NoteTable />

			</div>
		);
	}

}


export default Permissions;

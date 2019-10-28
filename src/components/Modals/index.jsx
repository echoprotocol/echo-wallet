import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalAddKey from './ModalAddKey';
import ModalEditPermissions from './ModalEditPermissions';
import ModalViewWIF from './ModalViewWIF';
import ModalConfirmEditingOfPermissions from './ModalConfirmEditingOfPermissions';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<React.Fragment>
				<ModalTokens />
				<ModalLogout />
				<ModalWipe />
				<ModalInfo />
				<ModalAddKey />
				<ModalEditPermissions />
				<ModalViewWIF />
				<ModalConfirmEditingOfPermissions />
			</React.Fragment>
		);
	}

}

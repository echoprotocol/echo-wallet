import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalEditPermissions from './ModalEditPermissions';
import ModalConfirmEditingOfPermissions from './ModalConfirmEditingOfPermissions';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<React.Fragment>
				<ModalTokens />
				<ModalLogout />
				<ModalWipe />
				<ModalInfo />
				<ModalEditPermissions />
				<ModalConfirmEditingOfPermissions />
			</React.Fragment>
		);
	}

}

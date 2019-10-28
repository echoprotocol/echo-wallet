import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalConfirmEditingOfPermissions from './ModalConfirmEditingOfPermissions';
import ModalAddProposalWIF from './ModalAddProposalWIF';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<React.Fragment>
				<ModalTokens />
				<ModalLogout />
				<ModalWipe />
				<ModalInfo />
				<ModalConfirmEditingOfPermissions />
				<ModalAddProposalWIF />
			</React.Fragment>
		);
	}

}

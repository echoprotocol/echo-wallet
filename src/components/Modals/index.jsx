import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalTokens from './ModalTokens';
import ModalDetails from './ModalDetails';
import ModalLogout from './ModalLogout';
import ModalChooseAccount from './ModalChooseAccount';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalUnlockWallet />
				<ModalTokens />
				<ModalDetails />
				<ModalLogout />
				<ModalChooseAccount />
			</div>
		);
	}

}

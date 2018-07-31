import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalTokens from './ModalTokens';
import ModalDetails from './ModalDetails';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalUnlockWallet />
				<ModalTokens />
				<ModalDetails />
			</div>
		);
	}

}

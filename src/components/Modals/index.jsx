import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalTokens from './ModalTokens';
import ConfirmTransaction from './ModalConfirmTransaction';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalUnlockWallet />
				<ModalTokens />
				<ConfirmTransaction />
			</div>
		);
	}

}

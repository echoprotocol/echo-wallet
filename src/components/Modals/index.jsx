import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalTokens from './ModalTokens';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalUnlockWallet />
				<ModalTokens />
			</div>
		);
	}

}
